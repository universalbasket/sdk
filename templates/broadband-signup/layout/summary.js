import { templates } from '/src/main.js';
import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import render from '../render.js';

export default {
    MobileTemplate: ({ inputs = {}, outputs = {}, cache = {}, /*local = {},*/ sdk, _ }) => {
        return render(MobileSummaryWrapper({ inputs, outputs, cache, sdk, _ }));
    },
    DesktopTemplate: ({ inputs = {}, outputs = {}, cache = {}, /*local = {},*/ sdk, _ }) => {
        return render(DesktopSummaryWrapper({ inputs, outputs, cache, sdk, _ }));
    }
};

function SummaryDetails({ outputs, inputs, cache, sdk }) {
    const priceObj = cache.oneOffCosts && cache.oneOffCosts.contents.find(o => o.name.match(/pay now/i));
    const next = cache.oneOffCosts && cache.oneOffCosts.contents.find(o => o.name.match(/next bill/i));
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
    <div class="summary__body">
        <article class="summary__block">
             <ul class="dim">
                ${inputs.selectedBroadbandPackage || selectedTvPackages || inputs.selectedPhonePackage ? html`
                    ${ inputs.selectedBroadbandPackage ? html`<li>Broadband: ${ inputs.selectedBroadbandPackage.name }</li>` : '' }
                    ${ selectedTvPackages ? html`<li>TV: ${ selectedTvPackages }</li>` : '' }
                    ${ inputs.selectedPhonePackage ? html`<li>Phone: ${ inputs.selectedPhonePackage.name }</li>` : '' }
                    ` : ''}

                ${outputs.serviceTermsAndConditions ? html`
                    <li>
                        <span
                            class="summary__popup-icon"
                            @click=${ () => templates.modal(
                                templates.markup(outputs.serviceTermsAndConditions, sdk),
                                { title: outputs.serviceTermsAndConditions.name }
                            ).show()
                            }>
                            <span class="clickable">${outputs.serviceTermsAndConditions.name}</span>
                        </span>
                    </li>` : ''}

                ${priceObj ? html`
                    <li class="summary__price">
                        <b class="large">
                            ${templates.priceDisplay(priceObj.price)}
                            ${next ? html` now then ${templates.priceDisplay(next.price)} added to next bill` : ''}
                        </b>
                    </li>` : ''}
            </ul>
        </article>

        ${cache.oneOffCosts ? html`
            <h4>${cache.oneOffCosts.name}</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${cache.oneOffCosts.contents.map(o => html`
                        <tr>
                            <th>${o.name}</th>
                            <td>${templates.priceDisplay(o.price)}</td>
                        </tr>`)}
                </table>
            </article>` : ''}


        ${cache.monthlyCosts ? html`
            <h4>${cache.monthlyCosts.name}</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${cache.monthlyCosts.contents.map(o => html`
                        <tr>
                            <th>${o.name}</th>
                            <td>${templates.priceDisplay(o.price)}</td>
                        </tr>`)}
                </table>
            </article>` : ''}
    </div>`;
}

function SummaryPreview({ outputs, inputs }) {
    const priceObj = outputs.oneOffCosts && outputs.oneOffCosts.contents.find(o => o.name.match(/pay now/i));
    const next = outputs.oneOffCosts && outputs.oneOffCosts.contents.find(o => o.name.match(/next bill/i));
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
        ${priceObj ? html`
            <b class="large summary__preview-price">
                ${templates.priceDisplay(priceObj.price)}
                ${next ? html` now then ${templates.priceDisplay(next.price)} added to next bill` : ''}
            </b>` : ''}
        ${inputs.selectedBroadbandPackage || selectedTvPackages || inputs.selectedPhonePackage ? html`
            <span class="faint summary__preview-info">
                ${ inputs.selectedBroadbandPackage ? html`<span>Broadband: ${ inputs.selectedBroadbandPackage.name }</span>` : '' }
                ${ selectedTvPackages ? html`<span>TV: ${ selectedTvPackages }</span>` : '' }
                ${ inputs.selectedPhonePackage ? html`<span>Phone: ${ inputs.selectedPhonePackage.name }</span>` : '' }

            </span>` : '' }`;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Broadband signup</span>
    `;
}

function hasContent(inputs) {
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');
    return inputs.selectedBroadbandPackage || selectedTvPackages || inputs.selectedPhonePackage;
}

// UI wrappers

// mobile
let isExpanded = false;
function MobileSummaryWrapper({ inputs, outputs, cache, sdk, _ }) {
    const update = new CustomEvent('update');
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (hasContent(inputs) && showDetails()) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ToggableWrapper(SummaryTitle(_))}
                ${SummaryDetails({ inputs, outputs, cache, sdk })}
            </aside>
            <div class="app__summary-overlay" @click=${toggleSummary}></div>`;
        }
        return html`
        <aside class="summary">
            ${ToggableWrapper(SummaryPreview({ inputs, outputs, cache }))}
        </aside>`;
    }

    return html`
    <aside class="summary">
        <header class="summary__header">${SummaryTitle(_)}</header>
    </aside>`;

    function ToggableWrapper(template) {
        const classes = {
            'summary__header': true,
            'summary__header--toggable': true,
            'summary__header--toggled-down': isExpanded,
            'summary__header--toggled-up': !isExpanded
        };
        return html`
            <header
                class="${classMap(classes)}"
                @click=${toggleSummary}>
                <div class="summary__preview">${template}</div>
            </header>`;
    }
}

// deskop
function DesktopSummaryWrapper({ inputs, outputs, cache, sdk, _ }) {
    return html`
    <aside class="summary">
        <header class="summary__header">${SummaryTitle(_)}</header>
        ${showDetails() ? SummaryDetails({ inputs, outputs, cache, sdk }) : ''}
    </aside>`;
}

function showDetails() {
    const route = window.location.hash.slice(1);
    return !['/error', '/confirmation'].includes(route);
}

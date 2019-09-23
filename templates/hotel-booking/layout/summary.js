import { modal, priceDisplay } from '../helpers/index.js';
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

function SummaryDetails({ outputs, inputs }) {

    const div = document.createElement('div');
    div.innerHTML = 'lalala';
    const price = inputs.selectedRooms && inputs.selectedRooms[0].price;

    return html`
    <div class="summary__body">
        <article class="summary__block">
             <ul class="dim">
                ${ inputs.selectedRooms && inputs.selectedRooms[0] ? html`
                    <b>${ inputs.selectedRooms[0].type }</b>
                    ${ inputs.selectedRooms[0].valueAdditions.map(i => html`<li>${ valueLabel(i) }</li>`) }
                    ` : ''}

                ${price ? html`
                    <li class="summary__price">
                        <b class="large">
                            ${ priceDisplay(price) }
                        </b>
                    </li>` : ''}
            </ul>
        </article>

        <a @click=${ () => modal(div, { title: 'Title of the modal' }).show() }>la-la-la</a>

        ${ outputs.priceBreakdown ? html`
            <article class="summary__block">
                <header class="summary__block-title">
                    Price Breakdown
                </header>
                <table class="table">
                    ${ outputs.priceBreakdown.map(i => html`
                        <tr>
                            <th>${ i.description } ${ i.type ? '· ' + priceType(i.type) : '' }</th>
                            <td>${ priceDisplay(i.price) }</td>
                        </tr>`) }
                </table>
            </article>` :
        '' }
    </div>`;
}

function SummaryPreview({ inputs }) {
    const price = inputs.selectedRooms && inputs.selectedRooms[0].price;

    return html`
        ${price ? html`
            <b class="large summary__preview-price">
                ${ priceDisplay(price) }
            </b>` : ''}
        ${inputs.selectedRooms && inputs.selectedRooms[0] ? html`
            <span class="faint summary__preview-info">
                <span>${ [inputs.selectedRooms[0].type, ...inputs.selectedRooms[0].valueAdditions.map(valueLabel)].join(', ') }</span>
            </span>` : ''}
    `;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Hotel Booking</span>
    `;
}

function valueLabel(code) {
    switch (code) {
        case 'pay-later': return 'Pay later';
        case 'free-breakfast': return 'Breakfast included';
        case 'free-internet': return 'Wi-fi';
        default: return code;
    }
}

function priceType(type) {
    switch (type) {
        case 'vat': return 'VAT';
        case 'total-now': return 'pay now';
        case 'total-later': return 'pay later';
        case 'total-later-supplier': return 'pay later';
        case 'total-overall': return 'TOTAL';
        case 'total-overall-supplier': return 'TOTAL';
        case 'others': return '';
        default: return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
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

    if (inputs.selectedRooms && inputs.selectedRooms[0] && showDetails()) {
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



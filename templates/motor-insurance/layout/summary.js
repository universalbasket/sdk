import { html, classMap, templates } from '/src/main.js';
import paymentTermLabel from '../inputs/selected-payment-term-label.js';

export default {
    MobileTemplate: (inputs = {}, outputs = {}, cache = {}, _local = {}, _) => {
        return MobileSummaryWrapper(inputs, outputs, cache, _);
    },
    DesktopTemplate: (inputs = {}, outputs = {}, cache = {}, _local = {}, _) => {
        return DesktopSummaryWrapper(inputs, outputs, cache, _);
    }
};

function SummaryDetails({ outputs, inputs }) {
    const monthly = outputs.priceBreakdown &&
        outputs.priceBreakdown.contents.find(NamedText => NamedText.name.match(/monthly/));

    const { make, model, yearOfManufacture, yearOfRegistration, registrationNumber } = outputs.vehicleDetails || {};
    const priceObj = outputs.estimatedPrice;

    return html`
    <div class="summary__body">
        <article class="summary__block">
             <ul class="dim">
                ${outputs.vehicleDetails ? html`
                    <b>Vehicle details</b>
                    ${make ? html`<li>Make: ${make}</li>` : ''}
                    ${model ? html`<li>Model: ${model}</li>` : ''}
                    ${yearOfManufacture ? html`<li>Year of manufacture: ${yearOfManufacture}</li>` : ''}
                    ${yearOfRegistration ? html`<li>Year of registration: ${yearOfRegistration}</li>` : ''}
                    ${registrationNumber ? html`<li>Registration number: ${registrationNumber}</li>` : ''}
                    ` : ''}

                ${priceObj ? html`
                    <li class="summary__price">
                        <b class="large">
                            ${templates.priceDisplay(priceObj.price)}
                            ${monthly ? html` today then ${monthly.text} per month` : ''}
                        </b>
                    </li>` : ''}
            </ul>
        </article>

        <div class="dim">
            ${inputs.selectedPaymentTerm ? html`<p>Payment term: <b>${paymentTermLabel(inputs.selectedPaymentTerm)}</b></p>` : ''}
            ${inputs.selectedNoClaimsDiscountProtection ? html`<p>No claims discount protection: <b>${inputs.selectedNoClaimsDiscountProtection}</b></p>` : ''}
        </div>

        ${outputs.priceBreakdown ? html`
            <h4>${outputs.priceBreakdown.name}</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${outputs.priceBreakdown.contents.map(o => html`
                        <tr>
                            <th>${o.name}</th>
                            <td>${o.text}</td>
                        </tr>`)}
                </table>
            </article>` : ''}

        ${outputs.excessBreakdown ? html`
            <h4>
                ${outputs.excessInfo ? html`
                    <span
                        class="summary__popup-icon"
                        @click=${ () => templates.modal(templates.markup(outputs.excessInfo), { title: outputs.excessBreakdown.name }).show() }>
                        <span class="clickable">${outputs.excessBreakdown.name}</span>
                    </span>` : ''}
            </h4>
            <article class="summary__block summary__block--bordered">
                <table class="table">
                    ${outputs.excessBreakdown.contents.map(o => html`
                        <tr>
                            <th>${o.name}</th>
                            <td>${o.text}</td>
                        </tr>`)}
                </table>
            </article>` : ''}

        ${outputs.financialPromotionRepresentativeExample ? html`
            <h4>${outputs.financialPromotionRepresentativeExample.name}</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${outputs.financialPromotionRepresentativeExample.contents.map(o => html`
                        <tr>
                            <th>${o.name}</th>
                            <td>${o.text}</td>
                        </tr>`)}
                </table>
            </article>` : ''}

        ${outputs.faq || outputs.insurerSpecificDocuments ? html`
            <div class="summary__block summary__block--bordered">
                <h4>Other information</h4>
                <ul class="dim">
                    <li>${templates.markup(outputs.faq)}</li>
                    ${outputs.insurerSpecificDocuments ? outputs.insurerSpecificDocuments.map(doc => html`<li>${ templates.markup(doc) }</li>`) : ''}
                </ul>
            </div>` : ''}
    </div>`;
}

function SummaryPreview({ outputs }) {
    const monthly = outputs.priceBreakdown &&
        outputs.priceBreakdown.contents.find(NamedText => NamedText.name.match(/monthly/));

    const { make, model, yearOfRegistration, registrationNumber } = outputs.vehicleDetails || {};
    const priceObj = outputs.estimatedPrice;

    return html`
        ${priceObj ? html`
            <b class="large summary__preview-price">
                ${templates.priceDisplay(priceObj.price)}
                ${monthly ? html` today then ${monthly.text} per month` : ''}
            </b>` : ''}
        ${outputs.vehicleDetails ? html`
            <span class="faint summary__preview-info">
                ${make ? html`<span>Make: ${make}</span>` : ''}
                ${model ? html`<span>Model: ${model}</span>` : ''}
                ${yearOfRegistration ? html`<span>Year: ${yearOfRegistration}</span>` : ''}
                ${registrationNumber ? html`<span>Reg: ${registrationNumber}</span>` : ''}
            </span>` : ''}
    `;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${title}</b>
        <span class="faint large">Motor Insurance</span>
    `;
}

// UI wrappers

// mobile
let isExpanded = false;
function MobileSummaryWrapper(inputs, outputs, cache, _) {
    const update = new CustomEvent('update');
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (hasContent() && showDetails()) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ToggableWrapper(SummaryTitle(_))}
                ${SummaryDetails({ inputs, outputs, cache })}
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

    function hasContent() {
        return outputs.vehicleDetails || outputs.estimatedPrice;
    }

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
function DesktopSummaryWrapper(inputs, outputs, cache, _) {
    return html`
    <aside class="summary">
        <header class="summary__header">${SummaryTitle(_)}</header>
        ${showDetails() ? SummaryDetails({ inputs, outputs, cache }) : ''}
    </aside>`;
}

function showDetails() {
    const route = window.location.hash.slice(1);
    return !['/error', '/confirmation'].includes(route);
}

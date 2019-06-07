import { html } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from '../../../src/builtin-templates/price-display.js';

const showModal = (...detail) => new CustomEvent('show-modal', { detail });

export {
    PriceInformation,
    OtherInformation,
    Documents
};

function PriceInformation({ cache = {}, outputs = {} }) {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    return priceObj ?
        html`
            <div class="summary__block">
                <b class="large highlight">
                    ${PriceDisplay(priceObj.price)}
                </b>
            </div>` :
        '';
}

function OtherInformation({ outputs }) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'StructuredText')
        .map(o => html`
            <li>
                <span
                    class="popup-icon"
                    @click=${() => window.dispatchEvent(showModal(o))}>
                    <span class="clickable">${o.name}</span>
                </span>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Other information</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;
}

function Documents({ outputs }) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'File')
        .map(o => html`
            <li class="file-icon">
                ${o.name}
            </li>`);

    if (items.length === 0) {
        return '';
    }

    // ${outputs.insuranceProductInformationDocument ? FileType(outputs.insuranceProductInformationDocument) : ''}
    // ${outputs.essentialInformation ? FileType(outputs.essentialInformation) : ''}
    // ${outputs.policyWording ? FileType(outputs.policyWording) : ''}
    // ${outputs.eligibilityConditions ? HtmlType(outputs.eligibilityConditions) : ''}
    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Documents</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;

}

// function FileType(data) {
//     return html`
//         <div>
//             <h5>${data.name}</h5>
//             <a>${data.filename}</a>
//         </div>
//     `;
// }

// function HtmlType(data) {
//     return html`
//         <div>
//             <h5>${data.name}</h5>
//             <pre style="display:none">${data.html}</pre>
//         </div>
//     `;
// }

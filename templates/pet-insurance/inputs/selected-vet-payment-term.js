import { html } from '/web_modules/lit-html/lit-html.js';

const key = 'selected-vet-payment-term';

export default function selectedVetPaymentTerm(output) {
    return html`
        <div class="field">
            <span class="field__name">Select Vet Payment Term </span>
            <select name="${key}">
                ${ output.map(o => html`<option value="${o}"> ${o}</option>`) }
            </select>
        </div>
    `;
}

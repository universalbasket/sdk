import { html } from '/web_modules/lit-html/lit-html.js';
const key = 'final-price-consent';

export default (priceConsent) => {
    return html`
    <div class="field field-set">
        <span class="field__name"></span>
        <h4 class="warning">By clicking continue, we are going to process your payment</h4>
        <input type="radio" name="${key}-$object" value="${JSON.stringify(priceConsent)}" required>
        <b>${ priceConsent.price.value } ${ priceConsent.price.currencyCode }</b>
    </div>
`};

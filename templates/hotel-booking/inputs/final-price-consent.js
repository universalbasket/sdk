import { html } from '/web_modules/lit-html/lit-html.js';
import { priceDisplay } from '../helpers/index.js';

export default (finalPrice, hide = true) => {
    return html`
        <input
            type=${hide ? 'hidden' : 'text'}
            id="final-price-consent"
            name="final-price-consent-$object"
            value="${ JSON.stringify(finalPrice) }" />
        <label
            for="final-price-consent"
            style=${ hide ? 'visibility: hidden' : '' }>
            ${ priceDisplay(finalPrice.price) }
        </label>`;
};

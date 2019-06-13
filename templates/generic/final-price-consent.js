import { html } from '/src/main.js';
import priceDisplay from '../../src/builtin-templates/price-display.js';

export default (finalPrice, hide = true) => {
    return html`
        <input
            type=${hide ? 'hidden' : 'text'}
            id="final-price-consent"
            name="final-price-consent-$object"
            value="${JSON.stringify(finalPrice)}" />
        <label for="final-price-consent" style=${hide ? 'visibility: hidden' : ''}>${priceDisplay(finalPrice.price)}</label>
        </div>`;
};

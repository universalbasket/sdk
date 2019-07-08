import { html, templates } from '/src/main.js';

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
            ${ templates.priceDisplay(finalPrice.price) }
        </label>`;
};

import { html } from '/web_modules/lit-html/lit-html.js';
import finalPriceConsent from '../../generic/final-price-consent.js';
import { createInputs } from '/src/main.js';

export default (name, { estimatedPrice = {}, finalPrice = {} }, skip) => {
    const finalValue = finalPrice.price && finalPrice.price.value;
    const estimatedValue = estimatedPrice.price && estimatedPrice.price.value;

    if (!finalValue || !estimatedValue) {
        throw new Error('found wrong final price/estimated price');
    }

    if (finalValue > estimatedValue) {
        const template = html`
            <h4>Price check</h4>
            <p>The final price has changed and will be:</p>
            ${priceTemplate(finalPrice.price)}
            <div class="section__actions">
                <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Confirm and pay</button>
            </div>
        `;

        window.dispatchEvent(showModal({ type: 'html', content: template }));

        return finalPriceConsent(finalPrice);
    }

    createInputs({ finalPriceConsent: finalPrice })
        .then(() => {
            skip();
            return '';
        });
};

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
            <p>The final price has changed. and will be:</p>
            ${priceTemplate(finalPrice.price)}
            <div class="section__actions field field-set">
                <button type="button" class="button button--right button--secondary" id="cancel-btn" @click="${Modal.close}">Cancel</button>
                <button type="button" class="button button--right button--primary" id="submit-btn-${name}" @click="${Modal.close}">Confirm and pay</button>
            </div>
        `;

        const modalTemplate = Modal.create(template, 'Price check', {
            closeOnOverlay: false,
            showClose: false
        });

        Modal.show(modalTemplate);

        return finalPriceConsent(finalPrice);
    }

    createInputs({ finalPriceConsent: finalPrice })
        .then(() => {
            skip();
            return '';
        });
};

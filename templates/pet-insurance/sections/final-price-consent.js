import finalPriceConsent from '../../generic/final-price-consent.js';
import { createInputs, templates, html } from '/src/main.js';

export default (name, { estimatedPrice = {}, finalPrice = {} }, skip, sdk) => {
    const finalValue = finalPrice.price && finalPrice.price.value;
    const estimatedValue = estimatedPrice.price && estimatedPrice.price.value;

    if (!finalValue || !estimatedValue) {
        throw new Error('found wrong final price/estimated price');
    }

    if (finalValue > estimatedValue) {
        //template to just display on modal
        const template = html`
            <p>The final price has changed. and will be:</p>
            <b class="large">${templates.priceDisplay(finalPrice.price)}</b>
            <div class="section__actions field field-set">
                <button type="button" class="button button--right button--secondary" id="cancel-btn">Cancel</button>
                <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Confirm and pay</button>
            </div>
        `;

        const modal = templates.modal(template, 'Price check', {
            closeOnOverlay: false,
            showClose: false
        });

        modal.show();

        document.querySelector(`#submit-btn-${name}`).addEventListener('click', modal.close);
        document.querySelector('#cancel-btn').addEventListener('click', () => {
            sdk.cancelJob().then(() => {
                modal.close();
            });
        });

        // return input field to the main form
        return finalPriceConsent(finalPrice);
    }

    createInputs(sdk, { finalPriceConsent: finalPrice })
        .then(() => {
            skip();
            return '';
        });
};

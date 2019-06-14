import finalPriceConsent from '../../generic/final-price-consent.js';
import { createInputs, templates, html } from '/src/main.js';

export default (name, { oneOffCosts = {}, finalPrice = {} }, skip) => {
    const finalValue = finalPrice.price.value;
    const estimatedPrice = oneOffCosts.contents && oneOffCosts.contents.find(_ => _.name === 'Pay now');
    let estimatedValue = 0;

    if (estimatedPrice && estimatedPrice.price) {
        estimatedValue = estimatedPrice.price.value;
    }

    if (!finalValue || !estimatedValue) {
        throw new Error('found wrong final price/estimated price');
    }

    if (finalValue > estimatedValue) {
        //template to just display on modal
        const template = html`
            <p>The final price has changed. and will be:</p>
            <b class="large">${templates.priceTemplate(finalPrice.price)}</b>
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

        document.querySelector(`submit-btn-${name}`).addEventListener('click', modal.close);
        document.querySelector('cancel').addEventListener('click', modal.close);

        // return input field to the main form
        return finalPriceConsent(finalPrice);
    }

    createInputs({ finalPriceConsent: finalPrice })
        .then(() => {
            skip();
            return '';
        });
};

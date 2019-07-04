import finalPriceConsent from '../../generic/final-price-consent.js';
import { createInputs, templates, html } from '/src/main.js';

export default (name, { estimatedPrice, finalPrice }, skip, sdk) => {
    const finalValue = finalPrice.price.value;
    const estimatedValue = estimatedPrice.price.value || 0;

    if (finalValue > estimatedValue) {
        //template to just display on modal
        const template = html`
            <p class="dim">The final price has changed and will be:</p>
            <b class="large">
                <s class="faint">${ templates.priceDisplay(estimatedPrice.price) }</s>
                ${ templates.priceDisplay(finalPrice.price) }
            </b>
            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--frameless"
                    id="cancel-btn">Cancel</button>
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Confirm and pay</button>
            </div>
        `;

        const modal = templates.modal(template, { title: 'Price check', isLocked: true });
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

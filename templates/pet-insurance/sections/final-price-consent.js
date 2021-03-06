import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import finalPriceConsentGeneric from '../inputs/final-price-consent.js';
import { createInputs, templates } from '/src/main.js';

export default function finalPriceConsent({ name, storage, skip, sdk }) {
    const estimatedPrice = storage.get('output', 'estimatedPrice');
    const finalPrice = storage.get('output', 'finalPrice');
    const finalValue = finalPrice.price && finalPrice.price.value;
    const estimatedValue = estimatedPrice.price && estimatedPrice.price.value;

    if (!finalValue || !estimatedValue) {
        throw new Error('found wrong final price/estimated price');
    }

    if (finalValue > estimatedValue) {
        //template to just display on modal
        const template = render(html`
            <p class="dim">The final price has changed and will be:</p>
            <b class="large">${ templates.priceDisplay(finalPrice.price) }</b>
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
        `);

        const modal = templates.modal(template, { title: 'Price check', isLocked: true });
        modal.show();

        document.querySelector(`#submit-btn-${name}`).addEventListener('click', modal.close);
        document.querySelector('#cancel-btn').addEventListener('click', () => {
            sdk.cancelJob().then(() => {
                modal.close();
            });
        });

        // return input field to the main form
        return render(finalPriceConsentGeneric(finalPrice));
    }

    createInputs(sdk, { finalPriceConsent: finalPrice })
        .then(() => skip());

    return render('');
}

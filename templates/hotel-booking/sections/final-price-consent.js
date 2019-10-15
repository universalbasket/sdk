import finalPriceConsentGeneric from '../inputs/final-price-consent.js';
import { createInputs } from '/src/main.js';
import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { priceDisplay, modal } from '../helpers/index.js';

export default function finalPriceConsent({ name, storage, skip, sdk }) {
    const selectedRooms = storage.get('input', 'selectedRooms');
    const finalPrice = storage.get('output', 'finalPrice');
    const finalValue = finalPrice.price.value;
    const estimatedPrice = selectedRooms[0] && selectedRooms[0].price || {};
    const estimatedValue = estimatedPrice.value || 0;

    if (finalValue > estimatedValue) {
        //template to just display on modal
        const template = render(html`
            <p class="dim">The final price has changed and will be:</p>
            <b class="large">${ priceDisplay(finalPrice.price) }</b>
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

        const m = modal(template, { title: 'Price check', isLocked: true });
        m.show();

        document.querySelector(`#submit-btn-${name}`).addEventListener('click', m.close);
        document.querySelector('#cancel-btn').addEventListener('click', () => {
            sdk.cancelJob().then(() => {
                m.close();
            });
        });

        // return input field to the main form
        return render(finalPriceConsentGeneric(finalPrice));
    }

    createInputs(sdk, { finalPriceConsent: finalPrice })
        .then(() => skip());

    return render('');
}

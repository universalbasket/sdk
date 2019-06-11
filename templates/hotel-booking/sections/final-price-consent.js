import { html } from '/web_modules/lit-html/lit-html.js';
import finalPriceConsent from '../../generic/final-price-consent.js';
import { createInputs } from '/web_modules/@ubio/sdk-application-bundle.js';

export default (name, { selectedRooms, finalPrice }, skip) => {
    const finalValue = finalPrice.price.value;
    const estimatedPrice = selectedRooms[0] && selectedRooms[0].price || {};
    const estimatedValue = estimatedPrice.value || 0;

    if (finalValue > estimatedValue) {
        return finalPriceConsent(finalPrice);
    }

    createInputs({ finalPriceConsent: finalPrice })
        .then(() => {
            skip();
            return html``;
        });

    return html``;
};

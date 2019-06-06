import { html } from '/web_modules/lit-html/lit-html.js';
import finalPriceConsent from '../../Generic/FinalPriceConsent.js';
import { createInputs } from '../../../src/main.js';

export default (name, { oneOffCosts, finalPrice }) => {
    const finalValue = finalPrice.price.value;
    const estimatedPrice = oneOffCosts.contents && oneOffCosts.contents.find(_ => _.name === 'Pay now');
    let estimatedValue = 0;

    if (estimatedPrice && estimatedPrice.price) {
        estimatedValue = estimatedPrice.price.value;
    }

    if (!finalValue || !estimatedValue) {
        return html``;
    }

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

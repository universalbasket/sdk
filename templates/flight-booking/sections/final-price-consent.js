import finalPriceConsentGeneric from '../inputs/final-price-consent.js';
import { createInputs, templates } from '/src/main.js';
import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

export default function finalPriceConsent(name, { finalPrice }, skip, sdk) {
    const finalValue = finalPrice.price.value;

    createInputs(sdk, { finalPriceConsent: finalPrice })
        .then(() => skip());

    return render('');
}

import { html } from '/web_modules/lit-html/lit-html.js';
const key = 'selected-no-claims-discount-protection';

export default function selectedNoClaimsDiscountProtection(output) {
    if (!output) {
        return '';
    }

    // TODO fix output's HTML and use SELECTEDPOLICYOPTION template instead
    const protection = output[0];

    return html`
        <div class="field">
            <span class="field__name">Would you like to protect your no-claims discount?</span>
            <div class="field__inputs group group--merged">
                <input
                    type="radio"
                    name="${key}-$object"
                    id="${key}-yes"
                    value="${ JSON.stringify(protection) }"
                    required
                    checked />
                <label for="${key}-yes" class="button">Yes</label>

                <input
                    type="radio"
                    name="${key}-$object"
                    id="${key}-no"
                    value="null" />
                <label for="${key}-no" class="button">No</label>
            </div>
    `;
}

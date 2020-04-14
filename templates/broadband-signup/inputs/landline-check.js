import { html } from '/web_modules/lit-html/lit-html.js';

export default function landlineCheck() {
    return html`
        <div name="landline-check" class="field-set">
            <div class="field">
                <label class="field__name" for="landline-check[postcode]">Zip Code</label>
                <input type="text" name="landline-check[postcode]" placeholder="90210" required />
            </div>

            <div class="field">
                <span class="field__name">First line</span>
                <input type="text" name="landline-check[firstline]" placeholder="" />
            </div>
        </div>
    `;
}


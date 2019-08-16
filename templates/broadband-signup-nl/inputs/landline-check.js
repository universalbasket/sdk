import { html } from '/web_modules/lit-html/lit-html.js';

export default function landlineCheck() {
    return html`
        <div name="landline-check" class="field-set">
            <div class="field">
                <label class="field__name" for="landline-check[postcode]">Post Code</label>
                <input type="text" name="landline-check[postcode]" placeholder="7812NL" required />
            </div>

            <div class="field">
                <span class="field__name">Street number</span>
                <input type="text" name="landline-check[streetNumber]" placeholder="76" required pattern="[0-9]{1,5}"/>
            </div>
        </div>
    `;
}

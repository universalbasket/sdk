import { html } from '/web_modules/lit-html/lit-html.js';

export default (prefix = 'address') => html`
<div name="${prefix}" class="filed-set">
    <div class="field">
        <label for="${prefix}[line1]" class="field__name">Line 1</label>
        <input type="text" name="${prefix}[line1]" id="${prefix}[line1]" required />
    </div>

    <div class="field">
        <label for="${prefix}[line2]" class="field__name">Line 2</label>
        <input type="text" name="${prefix}[line2]" id="${prefix}[line2]" />
    </div>

    <div class="field">
        <label for="${prefix}[city]" class="field__name">City</label>
        <input type="text" name="${prefix}[city]" id="${prefix}[city]" required />
    </div>

    <div class="field">
        <label for="${prefix}[country-subdivision]" class="field__name">County</label>
        <input type="text" name="${prefix}[country-subdivision]" id="${prefix}[country-subdivision]" required/>
    </div>

    <input type="hidden" name="${prefix}[country-code]" id="${prefix}[country-code]" maxlength=2 value="gb" required />

    <div class="field">
        <label for="${prefix}[postcode]" class="field__name">Postcode</label>
        <input type="text" name="${prefix}[postcode]" id="${prefix}[postcode]" minlength="6" required/>
    </div>
</div>
`;

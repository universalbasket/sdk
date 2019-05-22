import { html } from '../../src/lit-html';

export default (prefix = 'address') => html`
<div name="${prefix}" class="filed-set">
    <div class="field">
        <label for="${prefix}[line1]" class="field__name">Line 1</label>
        <input type="text" name="${prefix}[line1]" id="${prefix}[line1]" value="587" required />
    </div>

    <div class="field">
        <label for="${prefix}[line2]" class="field__name">Line 2</label>
        <input type="text" name="${prefix}[line2]" id="${prefix}[line2]" value="high road" />
    </div>

    <div class="field">
        <label for="${prefix}[city]" class="field__name">City</label>
        <input type="text" name="${prefix}[city]" id="${prefix}[city]" value="london" required />
    </div>

    <div class="field">
        <label for="${prefix}[country-subdivision]" class="field__name">County</label>
        <input type="text" name="${prefix}[country-subdivision]" id="${prefix}[country-subdivision]" value="London" required/>
    </div>

    <div class="field">
    <!-- select -->
        <label for="${prefix}[country-code]" class="field__name">Country Code</label>
        <input type="text" name="${prefix}[country-code]" id="${prefix}[country-code]" value="gb" required />
    </div>

    <div class="field">
        <label for="${prefix}[postcode]" class="field__name">Postcode</label>
        <input type="text" name="${prefix}[postcode]" id="${prefix}[postcode]" value="E11 4PB" required />
    </div>
</div>
`;

import { html } from '/web_modules/lit-html/lit-html.js';

export default function paymentAddress(prefix = 'address') {
    html`
        <div name="${prefix}" class="filed-set">
            <div class="field">
                <label
                    class="field__name"
                    for="${prefix}[postcode]">Post Code</label>
                <input
                    type="text"
                    name="${prefix}[postcode]"
                    required />
            </div>
            <div class="field">
                <label
                    class="field__name"
                    for="${prefix}[line1]">Line 1</label>
                <input
                    type="text"
                    placeholder="Clerkenwell Close"
                    name="${prefix}[line1]"
                    required />
            </div>
            <div class="field">
                <label
                    class="field__name"
                    for="${prefix}[line2]">Line 2</label>
                <input
                    type="text"
                    name="${prefix}[line2]" />
            </div>
            <div class="field">
                <label
                    class="field__name"
                    for="${prefix}[city]">City</label>
                <input
                    type="text"
                    name="${prefix}[city]"
                    required />
            </div>
            <div class="field">
                <label
                    class="field__name"
                    for="${prefix}[countrySubdivision]">County</label>
                <input
                    type="text"
                    name="${prefix}[countrySubdivision]"
                    required />
            </div>

            <input type="hidden" name="${prefix}[countryCode]" value="gb">
        </div>
    `;
}

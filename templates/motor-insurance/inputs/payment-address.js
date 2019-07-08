import { html } from '/web_modules/lit-html/lit-html.js';

export default function paymentAddress() {
    return html`
        <div class="field">
            <label
                class="field__name"
                for="payment[address][postcode]">Post Code</label>
            <input
                type="text"
                name="payment[address][postcode]"
                required />
        </div>
        <div class="field">
            <label
                class="field__name"
                for="payment[address][line1]">Line 1</label>
            <input
                type="text"
                placeholder="Clerkenwell Close"
                name="payment[address][line1]"
                required />
        </div>
        <div class="field">
            <label
                class="field__name"
                for="payment[address][line2]">Line 2</label>
            <input
                type="text"
                name="payment[address][line2]" />
        </div>
        <div class="field">
            <label
                class="field__name"
                for="payment[address][city]">City</label>
            <input
                type="text"
                name="payment[address][city]"
                required />
        </div>
        <div class="field">
            <label
                class="field__name"
                for="payment[address][countrySubdivision]">County</label>
            <input
                type="text"
                name="payment[address][countrySubdivision]"
                required />
        </div>

        <input type="hidden" name="payment[address][countryCode]" value="gb">
    `;
}

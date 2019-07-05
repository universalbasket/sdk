import { html } from '/src/main.js';

// https://protocol.automationcloud.net/Generic#Address
export default (prefix = '') => html`
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[address][postcode]">Post Code</label>
        <input
            type="text"
            placeholder="EC1R 0AT"
            name="${prefix}[address][postcode]"
            required />
    </div>
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[address][line1]">Line 1</label>
        <input
            type="text"
            placeholder="Clerkenwell Close"
            name="${prefix}[address][line1]"
            required />
    </div>
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[address][line2]">Line 2</label>
        <input
            type="text"
            name="${prefix}[address][line2]" />
    </div>
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[address][city]">City</label>
        <input
            type="text"
            placeholder="London"
            name="${prefix}[address][city]"
            required />
    </div>
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[address][countrySubdivision]">County</label>
        <input
            type="text"
            placeholder="London"
            name="${prefix}[address][countrySubdivision]"
            required />
    </div>

    <input type="hidden" name="${prefix}[address][countryCode]" value="gb">
`;

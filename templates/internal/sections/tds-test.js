import { html } from '/src/main.js';

export default (name, _data) => html`
    <div class="field">
        <label class="field__name" for="[amount]">Amount</label>
        <input
            type="text"
            name="[amount]"
            value="10.00"
            required />
    </div>

    <div class="field">
        <label class="field__name" for="[pan-token]">PAN token</label>
        <input
            type="text"
            name="[pan-token]"
            required />
    </div>

    <input type="hidden" name="[expiry-month]" value="12">
    <input type="hidden" name="[expiry-year]" value="2019">
    <input type="hidden" name="[security-code]" value="123">

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Pay</button>
    </div>
`;

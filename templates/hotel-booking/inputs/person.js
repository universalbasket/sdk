import { html } from '/src/main.js';

// https://protocol.automationcloud.net/HotelBooking#Person
export default (prefix = '') => html`
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[person][first-name]">First name</label>
        <input
            type="text"
            name="${prefix}[person][first-name]"
            pattern="^[A-Za-z]+$"
            data-error="First name should only contain letters (A-Z and a-z)"
            required />
    </div>

    <div class="field">
        <label
            class="field__name"
            for="${prefix}[person][last-name]">Last name</label>
        <input
            type="text"
            name="main-guest[person][last-name]"
            pattern="^[A-Za-z]+$"
            data-error="Last name should only contain letters (A-Z and a-z)"
            required />
    </div>
`;

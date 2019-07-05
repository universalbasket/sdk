import { html } from '/src/main.js';

// https://protocol.automationcloud.net/HotelBooking#GuestContact
export default (prefix = '') => html`
    <div class="field">
        <label
            class="field__name"
            for="${prefix}[contact][phone]">Phone number</label>
        <input
            type="text"
            name="${prefix}[contact][phone]"
            placeholder="07000000000"
            data-error="Please enter a valid phone number"
            required />
    </div>

    <div class="field">
        <label
            class="field__name"
            for="${prefix}[contact][email]">Email address</label>
        <input
            type="email"
            name="${prefix}[contact][email]"
            placeholder="example@example.com"
            pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
            data-error="Please enter a valid email address"
            required />
    </div>
`;

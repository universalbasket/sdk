import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

// https://protocol.automationcloud.net/HotelBooking#MainGuest

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

export default function guest(name) {
    return render(html`
        <h2>Account details</h2>

        <input
            type="hidden"
            name="account[isExisting-$object]"
            value="false" />

        <input
            type="hidden"
            name="account[password]"
            value=${ generatePassword() } />

        <div class="field">
            <label
                class="field__name"
                for="account[phone]">Phone number</label>
            <input
                type="hidden"
                name="account[phone][countryCode]"
                value="gb" />
            <input
                type="text"
                name="account[phone][number]"
                placeholder="07000000000"
                data-error="Please enter a valid phone number"
                required />
        </div>

        <div class="field">
            <label
                class="field__name"
                for="account[email]">Email address</label>
            <input
                type="email"
                name="account[email]"
                placeholder="example@example.com"
                pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                data-error="Please enter a valid email address"
                required />
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

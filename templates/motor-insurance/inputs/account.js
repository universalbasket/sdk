import { html } from '/src/main.js';

export default (inputs, outputs, cache, local, serviceName) => html`
    <div name="account" class="field-set">
        <span class="field__name">Your contact info</span>
        <p>In order to complete your policy, ${serviceName} requires your contact details</p>

        <div class="field">
            <label class="field__name" for="account[email]">Email</label>
            <input
                type="email"
                name="account[email]"
                placeholder="example@email.com"
                data-error="Please enter a valid email address"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="account[phone]">Mobile</label>
            <input type="hidden" name="account[phone][country-code]" value="gb">
            <input
                type="tel"
                name="account[phone][number]"
                placeholder="07420000000"
                data-error="Please enter a valid phone number"
                required />
        </div>

        <div>
            <input type="hidden" name="account[password]" value="">
            <input type="hidden" name="account[is-existing-$boolean]" value="false">
        </div>
    </div>`;

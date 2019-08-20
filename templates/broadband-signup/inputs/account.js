import { html } from '/web_modules/lit-html/lit-html.js';

export default function Account() {
    return html`
        <div name="account" class="filed-set">
            <div class="field filed-set">
                <label class="field__name" for="account[email]">Email</label>
                <input
                    type="email"
                    name="account[email]"
                    placeholder="example@example.com"
                    pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                    data-error="Please enter a valid email address"
                    required>
            </div>

            <div class="field filed-set">
                <label class="field__name" for="account[phone]">Mobile</label>
                <input
                    type="hidden"
                    name="account[phone][country-code]"
                    value="gb">
                <input
                    type="tel"
                    name="account[phone][number]"
                    placeholder="07912341234"
                    data-error="Please enter a valid phone number"
                    required>
            </div>

            <div>
                <input type="hidden" name="account[password]" value="">
                <input type="hidden" name="account[is-existing-$boolean]" value="false">
            </div>
        </div>`;
}

import { html } from '/web_modules/lit-html/lit-html.js';

export default function Account(prefix = 'account') {
    return html`
        <div name="${prefix}" class="filed-set">
            <div class="field filed-set">
                <label
                    class="field__name"
                    for="${prefix}[email]">Email</label>
                <input
                    type="email"
                    name="${prefix}[email]"
                    placeholder="example@example.com"
                    pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                    data-error="Please enter a valid email address"
                    required />
            </div>

            <div class="field filed-set">
                <label
                    class="field__name"
                    for="${prefix}[phone]">Mobile</label>
                <input
                    type="hidden"
                    name="${prefix}[phone][country-code]"
                    value="gb">
                <input
                    type="tel"
                    name="${prefix}[phone][number]"
                    placeholder="0205551111"
                    data-error="Please enter a valid phone number"
                    required />
            </div>

            <div>
                <input type="hidden" name="${prefix}[password]" value="">
                <input type="hidden" name="${prefix}[is-existing-$boolean]" value="false">
            </div>
        </div>`;
}

import { html } from '/web_modules/lit-html/lit-html.js';
import Person from './person.js';
import Address from './address.js';

export default function paymentDirectDebit() {
    return html`
        <div name="direct-debit" class="filed-set">
            <div class="field">
                <label
                    class="field__name"
                    for="direct-debit[sort-code]">Sort Code</label>
                <input
                    type="text"
                    name="direct-debit[sort-code]"
                    placeholder="560029"
                    required />
            </div>

            <div class="field">
                <label
                    class="field__name"
                    for="direct-debit[account-number]">Account Number</label>
                <input
                    type="text"
                    name="direct-debit[account-number]"
                    placeholder="26207729"
                    required />
            </div>

            <hr>
            <h2>Billing address</h2>
            ${Person('direct-debit[account-holder]')}
            ${Address('direct-debit[account-holder-address]')}
        </div>
    `;
}

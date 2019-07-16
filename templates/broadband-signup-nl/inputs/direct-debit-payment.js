import { html } from '/web_modules/lit-html/lit-html.js';

export default function paymentDirectDebit() {
    return html`
        <div name="direct-debit" class="filed-set">
            <div class="field">
                <label
                    class="field__name"
                    for="direct-debit[iban]">IBAN</label>
                <input
                    type="text"
                    name="direct-debit[iban]"
                    placeholder="NL91 ABNA 0417 1643 00"
                    required />
            </div>

            <div class="field">
                <label
                    class="field__name"
                    for="direct-debit[account-holder-name]">Account holder name</label>
                <input
                    type="text"
                    name="direct-debit[account-holder-name]"
                    placeholder="Bob Bobson"
                    required />
            </div>
        </div>
    `;
}

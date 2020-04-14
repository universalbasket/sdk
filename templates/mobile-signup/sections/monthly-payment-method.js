import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

export default function monthlyPaymentMethod({ name }) {
    return render(html`
        <div class="field">
            <span class="field__name">How do you want to pay monthly payment?</span>
            <div class="field__inputs group group--merged">
                <input
                    type="radio"
                    name="monthly-payment-method"
                    id="monthly-payment-method-card"
                    value="card"
                    required />
                <label
                    for="monthly-payment-method-card"
                    class="button">Card</label>

                <input
                    type="radio"
                    name="monthly-payment-method"
                    id="monthly-payment-method-directdebit"
                    value="directdebit"
                    required />
                <label
                    for="monthly-payment-method-directdebit"
                    class="button">Direct Debit</label>
            </div>
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Select</button>
        </div>
    `);
}

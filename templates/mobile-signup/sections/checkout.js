import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { CardPayment, DirectDebitPayment } from '../inputs/index.js';

export default function checkout({ name, storage }) {
    const otp = storage.get('_', 'otp');
    const monthlyPaymentMethod = storage.get('input', 'monthlyPaymentMethod');

    return render(html`
        ${ monthlyPaymentMethod === 'card' ? CardPayment(otp) : '' }
        ${ monthlyPaymentMethod === 'directdebit' ? DirectDebitPayment() : '' }

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Pay</button>
        </div>
    `);
}


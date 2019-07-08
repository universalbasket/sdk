import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { CardPayment, DirectDebitPayment } from '../inputs/index.js';

const Templates = {
    directdebit: DirectDebitPayment,
    card: CardPayment
};

export default function checkout(name, { otp, monthlyPaymentMethod }) {
    return render(html`
        ${ Templates[monthlyPaymentMethod](otp)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Pay</button>
        </div>
    `);
}


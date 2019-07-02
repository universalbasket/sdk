import { html } from '/src/main.js';
import { CardPayment, DirectDebitPayment } from '../inputs/index.js';

const Templates = {
    directdebit: DirectDebitPayment,
    card: CardPayment
};

export default (name, { otp, monthlyPaymentMethod }) => html`
    ${ Templates[monthlyPaymentMethod](otp)}

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Pay</button>
    </div>`;


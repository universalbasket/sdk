import { html } from '/web_modules/lit-html/lit-html.js';
import Person from '../../generic/person.js';
import Address from './payment-address.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default function paymentCard(otp) {
    return html`
        <div name="payment" class="filed-set">
            <h2>Billing address</h2>
            ${Person('payment[person]')}
            ${Address('payment[address]')}
            <hr>
            ${PaymentCardIframe(otp)}
        </div>
    `;
}

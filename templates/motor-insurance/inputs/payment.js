import { html } from '/src/main.js';
import Person from './payment-person.js';
import Address from './payment-address.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default function payment(otp) {
    return html`
        <h2>Billing address</h2>
        ${Person()}
        ${Address()}

        <hr>
        <h2>Card details</h2>
        ${PaymentCardIframe(otp)}
    `;
}

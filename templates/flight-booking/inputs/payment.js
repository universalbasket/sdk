import { html } from '/web_modules/lit-html/lit-html.js';

import PaymentCard from './payment-card.js';
import Address from './address.js';
import Person from './person.js';

export default function payment(otp) {
    return html`
        <h2>Card details</h2>
        ${PaymentCard(otp)}

        <h2>Billing address</h2>
        ${Person('payment')}
        ${Address('payment')}
    `;
}

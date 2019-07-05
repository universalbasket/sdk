import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

import PaymentCard from './payment-card.js';
import Address from './address.js';

export default function payment(otp) {
    return render(html`
        <h2>Billing address</h2>
        ${Address('payment')}

        <hr>
        <h2>Card details</h2>
        ${PaymentCard(otp)}

        <input type="hidden" name="payment[person][first-name]" value="na">
        <input type="hidden" name="payment[person][last-name]" value="na">
    `);
}

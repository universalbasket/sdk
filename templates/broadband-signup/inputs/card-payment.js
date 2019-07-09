import { html } from '/web_modules/lit-html/lit-html.js';
import Person from './person.js';
import Address from './address.js';
import PaymentCard from './payment-card.js';

export default otp => html`
    <div name="payment" class="filed-set">
        <h2>Billing address</h2>
        ${Person('payment[person]')}
        ${Address('payment[address]')}
        <hr>
        ${PaymentCard(otp)}
    </div>
`;

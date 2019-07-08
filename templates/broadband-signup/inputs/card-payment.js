import { html } from '/src/main.js';
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

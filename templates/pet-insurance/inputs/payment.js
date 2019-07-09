import { html } from '/src/main.js';
import PaymentCard from './payment-card.js';
import Address from './address.js';
import Person from './person.js';

export default otp => html`
    <h2>Billing address</h2>
    ${Person('payment')}
    ${Address('payment')}

    <hr>
    <h2>Card details</h2>
    ${PaymentCard(otp)}
`;

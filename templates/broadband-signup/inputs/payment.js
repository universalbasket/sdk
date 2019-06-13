import { html } from '/src/main.js';

import PaymentCard from '../../generic/payment-card.js';
import Address from '../../generic/address.js';
import Person from '../../generic/person.js';

export default otp => html`
    <h2>Card details</h2>
    ${PaymentCard(otp)}

    <h2>Billing Address</h2>
    ${Address('payment[address]')}
    ${Person('payment[person]')}
`;

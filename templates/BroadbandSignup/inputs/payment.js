import { html } from '/web_modules/lit-html.js';

import PaymentCard from '../../Generic/PaymentCard.js';
import Address from '../../Generic/Address.js';
import Person from '../../Generic/Person.js';

export default (otp) => html`
    <h2>Card details</h2>
    ${PaymentCard(otp)}

    <h2>Billing Address</h2>
    ${Address('payment[address]')}
    ${Person('payment[person]')}
`;

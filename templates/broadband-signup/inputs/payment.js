import { html } from '/src/main.js';

import PaymentCardIframe from '../../generic/payment-card-iframe.js';
import Address from '../../generic/address.js';
import Person from '../../generic/person.js';

export default otp => html`
    <h2>Card details</h2>
    ${PaymentCardIframe(otp)}

    <h2>Billing Address</h2>
    ${Address('payment[address]')}
    ${Person('payment[person]')}
`;

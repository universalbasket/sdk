import { html } from '/src/main.js';
import Person from '../../generic/person.js';
import Address from './payment-address.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default otp => html`
    <div name="payment" class="filed-set">
        <h2>Billing address</h2>
        ${Person('payment[person]')}
        ${Address('payment[address]')}
        <hr>
        ${PaymentCardIframe(otp)}
    </div>
`;

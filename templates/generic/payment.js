import { html } from '/web_modules/lit-html/lit-html.js';
import Person from './person.js';
import Address from './address.js';
import PaymentCard from './payment-card.js';

export default (otp, prefix = 'payment') => html`
<div class="filed-set">
    ${Person(`${prefix}[person]`)}
    ${PaymentCard(otp)}
    ${Address(`${prefix}[address]`)}
</div>
`;

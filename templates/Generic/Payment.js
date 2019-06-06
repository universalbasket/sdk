import { html } from '/web_modules/lit-html/lit-html.js';
import Person from './Person.js';
import Address from './Address.js';
import PaymentCard from './PaymentCard.js';

export default (otp, prefix = 'payment') => html`
<div class="filed-set">
    ${Person(`${prefix}[person]`)}
    ${PaymentCard(otp)}
    ${Address(`${prefix}[address]`)}
</div>
`;

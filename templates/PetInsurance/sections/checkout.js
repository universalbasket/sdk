import { html } from '/web_modules/lit-html.js';
import payment from '../../Generic/Payment.js';

export default (name, { otp }, skip) => html`
    ${payment(otp)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Pay</button>
        <button type="button" class="button button--right" id="skip-btn-${name}" @click="${skip}">skip(dev)</button>
    </div>
`;

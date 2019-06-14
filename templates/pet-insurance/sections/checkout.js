import { html } from '/src/main.js';
import payment from '../../generic/payment.js';

export default (name, { otp }) => html`
    ${payment(otp)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Pay</button>
    </div>
`;

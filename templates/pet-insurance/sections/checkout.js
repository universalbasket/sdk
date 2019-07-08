import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import payment from '../../generic/payment.js';

export default function checkout(name, { otp }) {
    return render(html`
        ${payment(otp)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Pay</button>
        </div>
    `);
}

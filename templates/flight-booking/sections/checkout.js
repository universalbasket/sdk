import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';
import { Payment } from '../inputs/index.js';

export default function checkout(name, { otp, estimatedPrice }) {
    return render(html`
        ${Payment(otp)}
        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Pay ${ templates.priceDisplay(estimatedPrice.price) }</button>
        </div>
    `);
}

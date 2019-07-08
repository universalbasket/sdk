import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { payment } from '../inputs/index.js';

export default function checkout(name, data) {
    return render(html`
        ${payment(data.otp)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Pay</button>
        </div>
    `);
}

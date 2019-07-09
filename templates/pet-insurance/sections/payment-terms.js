import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedPaymentTerm } from '../inputs/index.js';

export default function paymentTerms(name, { availablePaymentTerms }) {
    return render(html`
        ${selectedPaymentTerm(availablePaymentTerms)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">
                Find Cover
            </button>
        </div>
    `);
}

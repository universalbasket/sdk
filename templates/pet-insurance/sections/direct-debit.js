import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { directDebit as input } from '../inputs/index.js';

export default function directDebit({ name, storage, skip }) {
    const selectedPaymentTerm = storage.get('input', 'selectedPaymentTerm');

    if (selectedPaymentTerm !== 'monthly-card') {
        return skip();
    }

    return render(html`
        ${input()}
        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
        </div>
    `);
}

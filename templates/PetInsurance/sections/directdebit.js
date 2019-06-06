import { html } from '/web_modules/lit-html.js';
import { directDebit } from '../inputs/index.js';

export default (name, { selectedPaymentTerm }, skip) => {
    if (selectedPaymentTerm !== 'monthly-card') {
        skip();
        return;
    }

    return html`
        ${directDebit()}
        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
            <button type="button" class="button button--right" id="skip-btn-${name}" @click="${skip}">skip(dev)</button>
        </div>
    `;
};

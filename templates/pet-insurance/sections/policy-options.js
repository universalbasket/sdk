import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { policyOptions as policyOptionsInput, selectedCover, selectedPaymentTerm } from '../inputs/index.js';

export default function policyOptions({ name, data: { availableCovers, availablePaymentTerms } }) {
    return render(html`
        ${policyOptionsInput()}
        ${selectedCover(availableCovers)}
        ${selectedPaymentTerm(availablePaymentTerms)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
        </div>
    `);
}

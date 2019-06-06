import { html } from '/web_modules/lit-html.js';
import { policyOptions, selectedCover, selectedPaymentTerm } from '../inputs/index.js';

export default (name, { availableCovers, availablePaymentTerms }, skip) => html`
    ${policyOptions()}
    ${selectedCover(availableCovers)}
    ${selectedPaymentTerm(availablePaymentTerms)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
        <button type="button" class="button button--right" id="skip-btn-${name}" @click="${skip}">skip(dev)</button>
    </div>
`;

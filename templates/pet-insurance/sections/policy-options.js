import { html } from '/src/main.js';
import { policyOptions, selectedCover, selectedPaymentTerm } from '../inputs/index.js';

export default (name, { availableCovers, availablePaymentTerms }) => html`
    ${policyOptions()}
    ${selectedCover(availableCovers)}
    ${selectedPaymentTerm(availablePaymentTerms)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
    </div>
`;

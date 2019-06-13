import { html } from '/src/main.js';
import { selectedPaymentTerm } from '../inputs/index.js';

export default (name, { availablePaymentTerms }) => html`
    ${selectedPaymentTerm(availablePaymentTerms)}

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">
            Find Cover
        </button>
    </div>
`;

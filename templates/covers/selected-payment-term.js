import { html } from '../../src/lit-html';

/* templates */
import selectedInput from '../selected-input';

export default () => html`
<div class="section">
    <h3 class="section__header">Your Covers</h3>
    <form class="section__body">
        ${selectedInput(meta)}
    </form>

    <button type="button" class="button button--right button--primary" id="submit">Continue</button>
</div>
`;

const meta =
    {
        inputKey: 'selectedPaymentTerm',
        title: 'Select your payment term',
        inputMethod: "SelectOne",
        sourceOutputKey: 'availablePaymentTerms'
    };

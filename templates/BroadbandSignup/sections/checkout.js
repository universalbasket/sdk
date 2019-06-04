import { html, render } from 'lit-html';
import { payment, directDebit } from '../inputs/index';

export default (name, data) => html`
    ${payment()}

    <div class="field">
        <span class="field__name">How do you want to pay monthly payment?</span>
        <div class="field__inputs group group--merged">
            <input type="radio" name="monthly-payment-method" id="monthly-payment-method-card"
                value="card" @click="${onChange}" required checked>
            <label for="monthly-payment-method-card" class="button">Card</label>

            <input type="radio" name="monthly-payment-method" id="monthly-payment-method-directdebit"
                value="directdebit" @click="${onChange}"required>
            <label for="monthly-payment-method-directdebit" class="button">Direct Debit</label>
        </div>
    </div>

    <div id="direct-debit-wrapper"></div>


    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Pay</button>
    </div>
`;

const onChange = {
    handleEvent(e) {
        const paymentMethod = e.target.value;
        const showDirectDebit = paymentMethod === 'directdebit';

        render(showDirectDebit ? directDebit() : html``, document.querySelector('#direct-debit-wrapper'));
    },
};

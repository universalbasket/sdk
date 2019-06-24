import { html, templates } from '/src/main.js';
const key = 'selected-payment-term';

function label(key) {
    return {
        'annual-card': 'Annual',
        'monthly-card': 'Monthly by credit/debit card',
        'monthly-directdebit': 'Monthly by direct debit',
        'monthly-directdebit-card': 'Monthly by direct debit'
    }[key];
}

export default output => html`
    <div class="field field--list">
        <span class="field__name">How would you like to pay?</span>
        ${ output.map(o => html`
            <div class="field-item field-item--select-one">
                <div class="field-item__details">
                    <strong>${ label(o) }</strong>
                    <br>
                    £0.00 per PERIOD
                </div>
                <div class="field__inputs">
                    <input
                        type="radio"
                        id="${key}-${o}"
                        name="${key}"
                        value="${o}"
                        required />
                    <label
                        for="${key}-${o}"
                        class="button">Select</label>
                </div>
            </div>
        `) }
    </div>
`;

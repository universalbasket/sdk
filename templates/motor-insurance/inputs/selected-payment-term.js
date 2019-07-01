import { html } from '/src/main.js';
import label from './selected-payment-term-label.js';

const key = 'selected-payment-term';

export default output => html`
    <div class="field field--list">
        <span class="field__name">How would you like to pay?</span>
        ${output.map(o => html`
            <div class="field-item field-item--select-one">
                <div class="field-item__details">
                    <strong>${label(o)}</strong>
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
            </div>`)}
    </div>
`;

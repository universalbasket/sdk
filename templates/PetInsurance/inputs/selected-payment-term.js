import { html } from '/web_modules/lit-html/lit-html.js';

export default terms => html`
    <div class="field field-set">
        <span class="field__name">Select Payment term</span>
        <div class="field__inputs group group--merged">
        ${ terms.map(term => html`
            <input
                type="radio"
                name="selected-payment-term"
                value="${term}"
                id="selected-payment-term-${term}"
                required>
            <label for="selected-payment-term-${term}" class="button">${term}</label>
            `)}
        </div>
    </div>
`;

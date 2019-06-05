import { html } from '/web_modules/lit-html.js';

export default () => html`
<div name="policy-options" class="filed-set">
    <div class="field">
        <label class="field__name" for="policy-options[cover-start-date]">Cover start date</label>
        <input type="date" name="policy-options[cover-start-date]" value="2019-06-01" minDate="${new Date()}" required>
    </div>

    <div class="field">
        <label class="field__name" for="policy-options[number-of-pets-owned-$number]">How Many cats and dogs are in your household?</label>
        <input type="tel" name="policy-options[number-of-pets-owned-$number]" value="1" required />
    </div>
</div>`;

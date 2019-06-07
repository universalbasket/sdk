import { html } from '/web_modules/lit-html/lit-html.js';

export default () => html`
<div name="policy-options" class="filed-set">
    <div class="field">
        <label class="field__name" for="policy-options[cover-start-date]">Cover start date</label>
        <input type="date" name="policy-options[cover-start-date]" min="${getMinDate()}" max="${getMaxDate()}" required>
    </div>

    <div class="field">
        <label class="field__name" for="policy-options[number-of-pets-owned-$number]">How Many cats and dogs are in your household?</label>
        <input type="tel" name="policy-options[number-of-pets-owned-$number]" value="1" required />
    </div>
</div>`;

function getMinDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]
}

function getMaxDate() {
    const date = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const thirtyDaysLater = new Date(date + thirtyDays);
    return thirtyDaysLater.toISOString().split('T')[0]
}

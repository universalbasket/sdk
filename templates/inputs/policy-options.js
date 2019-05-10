import { html } from '../../src/lit-html';

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

    <div class="field">
        <span class="field__name" for="policy-options[joint-policy-holder-$boolean]">Do you want to include a joint policy holder </span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="policy-options[joint-policy-holder-$boolean]"
                id="policy-options[joint-policy-holder]-yes"
                value="true" required checked>
            <label
                for="policy-options[joint-policy-holder]-yes"
                class="button">Yes</label>

            <input
                type="radio"
                class="button"
                name="policy-options[joint-policy-holder-$boolean]"
                id="policy-options[joint-policy-holder]-no"
                value="false">
            <label
                for="policy-options[joint-policy-holder]-no"
                class="button">No</label>
        </div>
    </div>
</div>`;

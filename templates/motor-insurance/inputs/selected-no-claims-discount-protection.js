import { html } from '/src/main.js';
// const key = 'selected-no-claims-discount-protection';

export default output => {
    if (!output) {
        return '';
    }

    return html`
    <div class="field">
        <span class="field__name">Would you like to protect your no-claims discount?</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="selected-no-claims-discount-protection-object"
                id="selected-no-claims-discount-protection-yes"
                value="${ JSON.stringify(output) }"
                required
                checked />
            <label for="selected-no-claims-discount-protection-yes" class="button">Yes</label>

            <input
                type="radio"
                name="selected-no-claims-discount-protection-object"
                id="selected-no-claims-discount-protection-no"
                value="null" />
            <label for="selected-no-claims-discount-protection-no" class="button">No</label>
        </div>
    </div>`;
};

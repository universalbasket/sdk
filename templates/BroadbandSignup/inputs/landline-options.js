import { html } from '/web_modules/lit-html/lit-html.js';

export default () => html`
<div name="landline-options">
    <div class="field field-set">
        <span class="field__name">Just Moved?</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="landline-options[just-moved-$boolean]"
                id="landline-options[just-moved-$boolean]-true"
                value="true"
                required />
            <label for="landline-options[just-moved-$boolean]-true" class="button">Yes</label>

            <input
                type="radio"
                name="landline-options[just-moved-$boolean]"
                id="landline-options[just-moved-$boolean]-false"
                value="false" />
            <label for="landline-options[just-moved-$boolean]-false" class="button">No</label>
        </div>
    </div>

    <div class="field field-set">
        <span class="field__name">Is shared property?</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="landline-options[shared-property-$boolean]"
                id="landline-options[shared-property-$boolean]-true"
                value="true"
                required />
            <label for="landline-options[shared-property-$boolean]-true" class="button">Yes</label>

            <input
                type="radio"
                name="landline-options[shared-property-$boolean]"
                id="landline-options[shared-property-$boolean]-false"
                value="false" />
            <label for="landline-options[shared-property-$boolean]-false" class="button">No</label>
        </div>
    </div>

    <div class="field field-set">
        <span class="field__name">Restart Line?</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="landline-options[restart-line-$boolean]"
                id="landline-options[restart-line-$boolean]-true"
                value="true"
                required />
            <label for="landline-options[restart-line-$boolean]-true" class="button">Yes</label>

            <input
                type="radio"
                name="landline-options[restart-line-$boolean]"
                id="landline-options[restart-line-$boolean]-false"
                value="false" />
            <label for="landline-options[restart-line-$boolean]-false" class="button">No</label>
        </div>
    </div>

    <div class="field field-set">
        <span class="field__name">Additional Line?</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="landline-options[additional-line-$boolean]"
                id="landline-options[additional-line-$boolean]-true"
                value="true"
                required />
            <label for="landline-options[additional-line-$boolean]-true" class="button">Yes</label>

            <input
                type="radio"
                name="landline-options[additional-line-$boolean]"
                id="landline-options[additional-line-$boolean]-false"
                value="false" />
            <label for="landline-options[additional-line-$boolean]-false" class="button">No</label>
        </div>
    </div>
</div>
`;

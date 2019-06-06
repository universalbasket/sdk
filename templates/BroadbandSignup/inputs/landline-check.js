import { html } from '/web_modules/lit-html/lit-html.js';

export default () => html`
<div name="landline-check">
    <div class="field field-set">
        <label class="field__name" for="landline-check[postcode]">Post Code</label>
        <input type="text" name="landline-check[postcode]" placeholder="EC1R 0AT" required />
    </div>

    <div class="field field-set">
        <span class="field__name">Land line</span>
        <input type="text" name="landline-check[landline]" placeholder="01413231231" pattern="^0[0-9]{8,10}"/>
    </div>

    <div class="field field-set">
        <span class="field__name">Are you a bill payer?</span>
        <div class="field__inputs group group--merged">
            <input type="radio" value="true" name="landline-check[billpayer-$boolean]" id="landline-check[billpayer]-yes"/>
            <label for="landline-check[billpayer]-yes" class="button">Yes</label>

            <input type="radio" value="false" name="landline-check[billpayer-$boolean]" id="landline-check[billpayer]-no">
            <label for="landline-check[billpayer]-no" class="button">No</label>
        </div>
    </div>
</div>
`;

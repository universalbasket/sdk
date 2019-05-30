import { html } from '../../../src/lit-html';

export default () => html`
<div name="installation">
    <div class="field field-set">
        <span class="field__name">What is you property type? </span>
        <div class="field__inputs group group--merged">
            <input type="radio" name="installation[property-type]" id="installation[property-type]-flat"
                value="flat" required checked>
            <label for="[property-type]-flat" class="button">Flat</label>

            <input type="radio" name="installation[property-type]"
                id="[property-type]-house" value="house">
            <label for="[property-type]-house" class="button">House</label>
        </div>
    </div>

    <div class="field field-set">
        <span class="field__name">Is there any access Restriction? </span>
        <div class="field__inputs group group--merged">
            <input type="radio" name="installation[access-restrictions]" id="installation-access-restrictions-yes"
                value="yes" required>
            <label for="installation-access-restrictions-yes" class="button">Yes</label>

            <input type="radio" name="installation[access-restrictions]" id="installation-access-restrictions-no"
                value="no" required checked>
            <label for="installation-access-restrictions-no" class="button">No</label>
        </div>
    </div>

    <div class="field field-set">
        <span class="field__name">Has access to communal satellite?</span>
        <div class="field__inputs group group--merged">
            <input type="radio" name="installation[has-access-to-communal-satellite-$boolean]" id="installation-satellite-yes"
                value="true" required checked>
            <label for="installation-satellite-yes" class="button">Yes</label>

            <input type="radio" name="installation[has-access-to-communal-satellite-$boolean]" id="installation-satellite-no"
                value="false" required>
            <label for="installation-satellite-no" class="button">No</label>
        </div>
    </div>
</div>
`;
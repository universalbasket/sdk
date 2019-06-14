import { html } from '/src/main.js';

export default (installationOptions = {}) => html`
<div name="installation">
    ${propertyType(installationOptions.propertyTypes)}
    ${selectFields(installationOptions.storeySelection, 'What floor do you live on?', 'installation[storey-selection]')}
    ${selectFields(installationOptions.accessRestrictions, 'Are there any access restrictions?', 'installation[access-restrictions]')}
    ${selectFields(installationOptions.parkingRestrictions, 'Are there any parking restrictions?', 'installation[parking-restrictions]')}

    <div class="field">
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

function propertyType(propertyTypes) {
    if (!propertyTypes || propertyTypes.length === 0) {
        return '';
    }

    return html`
        <div class="field">
            <span class="field__name">What is you property type? </span>
            <div class="field__inputs group group--merged">
                ${propertyTypes.map(type => html`
                    <input type="radio" name="installation[property-type]" id="installation[property-type]-${type}" value="${type}" required>
                    <label for="installation[property-type]-${type}" class="button">${type}</label>
                `)}
            </div>
        </div>
    `;
}

function selectFields(data, label, name) {
    if (!data || data.length === 0) {
        return '';
    }
    return html`
        <div class="field">
            <span class="field__name">${label}</span>
                <select name="${name}" required>
                    ${data.map(d => html`<option value="${d}">${d}</option> `)}
                </select>
            </div>
        </div>
    `;
}

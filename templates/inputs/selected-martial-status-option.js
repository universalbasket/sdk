import { html } from '../../src/lit-html';

export default (maritalStatusOptions) => html`
<div class="field">
    <span class="field__name">Marital Status</span>
    <select  name="selected-marital-status-option">
        ${ maritalStatusOptions.map(ms => html`
            <option value="${ms}"> ${ms} </option>`
        )}
    </select>
</div>`;

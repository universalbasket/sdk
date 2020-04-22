import { html } from '/web_modules/lit-html/lit-html.js';

// https://protocol.automationcloud.net/Generic#Address
export default (prefix = '') => html`
<div class="field">
    <label
        class="field__name"
        for="${prefix}[person][title]">Title</label>
    <select
        name="${prefix}[person][title]"
        id="${prefix}[person][title]"
        required>
        <option value="mr">Mr</option>
        <option value="ms">Ms</option>
        <option value="mrs">Mrs</option>
    </select>
</div>

<div class="field">
    <label
        class="field__name"
        for="${prefix}[person][first-name]">First name</label>
    <input
        type="text"
        name="${prefix}[person][first-name]"
        id="${prefix}[person][first-name]"
        pattern="^[A-Za-z]+$"
        data-error="First name should only contain letters (A-Z and a-z)"
        required />
</div>

<div class="field">
    <label
        class="field__name"
        for="${prefix}[person][last-name]">Last name</label>
    <input
        type="text"
        name="${prefix}[person][last-name]"
        id="${prefix}[person][last-name]"
        pattern="^[A-Za-z]+$"
        data-error="Last name should only contain letters (A-Z and a-z)"
        required />
</div>
`;

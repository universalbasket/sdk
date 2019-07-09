import { html } from '/web_modules/lit-html/lit-html.js';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default (prefix = '') => html`
    <div class="field">
        <label class="field__name">Title</label>
        <select
            name="${prefix}[person][title]"
            required>
            ${ TITLES.map(t => html`<option value="${ t }">${ t.toUpperCase() }</option>`) }
        </select>
    </div>

    <div class="field">
        <label class="field__name" for="${prefix}[person][first-name]">First Name</label>
        <input
            type="text"
            name="${prefix}[person][first-name]"
            pattern="^[A-Za-z]+$"
            data-error="First name should only contain letters (A-Z and a-z)"
            required />
    </div>

    <div class="field">
        <label class="field__name" for="${prefix}[person][last-name]">Last Name</label>
        <input
            type="text"
            name="${prefix}[person][last-name]"
            pattern="^[A-Za-z]+$"
            data-error="Last name should only contain letters (A-Z and a-z)"
            required />
    </div>
`;

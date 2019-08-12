import { html } from '/web_modules/lit-html/lit-html.js';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default (prefix = 'person') => html`
    <div class="field">
        <label class="field__name">Title</label>
        <select
            name="${prefix}[title]"
            required>
            ${ TITLES.map(t => html`<option value="${ t }">${ t.toUpperCase() }</option>`) }
        </select>
    </div>

    <div class="field">
        <label class="field__name" for="${prefix}[first-name]">First Name</label>
        <input
            type="text"
            name="${prefix}[first-name]"
            pattern="^[A-Za-z\\s]+$"
            data-error="First name should only contain letters (A-Z and a-z)"
            required />
    </div>


    <div class="field">
        <label class="field__name" for="${prefix}[first-name]">Middle Name</label>
        <input
            type="text"
            name="${prefix}[middle-name]"
            pattern="^[A-Za-z\\s]+$"
            data-error="Middle name should only contain letters (A-Z and a-z)"/>
    </div>

    <div class="field">
        <label class="field__name" for="${prefix}[last-name]">Last Name</label>
        <input
            type="text"
            name="${prefix}[last-name]"
            pattern="^[A-Za-z\\s]+$"
            data-error="Last name should only contain letters (A-Z and a-z)"
            required />
    </div>
`;

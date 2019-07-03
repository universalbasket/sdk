import { html } from '/src/main.js';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default (prefix = 'person') => html`
    <div name="${prefix}" class="filed-set">
        <div class="field">
            <label class="field__name">Title</label>
            <select
                name="${prefix}[title]"
                required>
                ${ TITLES.map(t => html`<option value="${t}"> ${ t.toUpperCase() }</option>`) }
            </select>
        </div>

        <div class="field">
            <label
                class="field__name"
                for="${prefix}[first-name]">First Name</label>
            <input
                type="text"
                name="${prefix}[first-name]"
                pattern="^[A-Za-z]+$"
                data-error="First name should only contain letters (A-Z and a-z)"
                required />
        </div>

        <div class="field">
            <label
                class="field__name"
                for="${prefix}[middle-name]">Middle Name</label>
            <input
                type="text"
                name="${prefix}[middle-name]" />
        </div>

        <div class="field">
            <label
                class="field__name"
                for="${prefix}[last-name]">Last Name</label>
            <input
                type="text"
                name="${prefix}[last-name]"
                pattern="^[A-Za-z]+$"
                data-error="Last name should only contain letters (A-Z and a-z)"
                required />
        </div>
    </div>
    `;

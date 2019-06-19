import { html } from '/src/main.js';
const key = 'selected-address';

export default output => html`
    <div class="field">
        <span class="field__name">Address</span>
        <select name="${key}" required>
            ${ output.map(o => html`<option value="${o}"> ${o}</option>`) }
        </select>
    </div>
`;


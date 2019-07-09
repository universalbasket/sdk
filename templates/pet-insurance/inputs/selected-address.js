import { html } from '/web_modules/lit-html/lit-html.js';

const key = 'selected-address';

export default function selectedAddress(output) {
    return html`
        <div class="field">
            <span class="field__name">Address</span>
            <select name="${key}" required>
                ${ output.map(o => html`<option value="${o}"> ${o}</option>`) }
            </select>
        </div>
    `;
}

import { html } from '/src/main.js';

const key = 'selected-vet-payment-term';

export default output => html`
    <div class="field">
        <span class="field__name">Select Vet Payment Term </span>
        <select name="${key}">
            ${ output.map(o => html`<option value="${o}"> ${o}</option>`) }
        </select>
    </div>`;

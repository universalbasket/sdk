import { html } from '/src/main.js';
const key = 'selected-voluntary-excess-$object';

export default output => html`
    <div class="field">
        <span class="field__name">Voluntary excess</span>
        <select name="${key}" required>
            ${ output.map(o => html`<option value="${JSON.stringify(o)}"> ${o.priceLine}</option>`) }
        </select>
    </div>
`;

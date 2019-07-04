import { html, templates } from '/src/main.js';
const key = 'selected-cover-options';

export default output => html`
    <div id="${key}" class="field field--list">
        <span class="field__name">Select Covers</span>
        ${ output.map(o => html`
            <div class="field-item field-item--multi-select">
                <input
                    type="checkbox"
                    value="${JSON.stringify(o)}"
                    name="${key}-$object[]"
                    id="${key}-${o.name}"
                    required />
                <div>
                    <b>${o.name}</b><br />
                    <b>${ templates.priceDisplay(o.price) }</b>
                </div>
            </div>
        `) }
    </div>
`;

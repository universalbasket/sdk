import { html } from '/src/main.js';

import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

export default (name, data = {}) => html`
    ${LandlineCheck()}
    ${data.landlineOptions ? hidden(data.landlineOptions) : LandlineOptions() }

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
    </div>
`;

function hidden(data) {
    return html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;
}

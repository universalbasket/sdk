import { html } from '/src/main.js';

import { landlineCheck, landlineOptions } from '../inputs/index.js';

export default (name, data = {}) => html`
    ${landlineCheck()}
    ${data.landlineOptions ? hidden(data.landlineOptions) : landlineOptions() }

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
    </div>
`;

function hidden(data) {
    return html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;
}

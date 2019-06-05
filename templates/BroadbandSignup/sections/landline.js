import landlineCheck from '../inputs/landline-check.js';
import landlineOption from '../inputs/landline-options.js';

import { html } from '/web_modules/lit-html.js';

export default (name, data = {}) => html`
    ${landlineCheck()}
    ${data.landlineOption ? hidden(data.landlineOption) : landlineOption() }

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
    </div>
`;

const hidden = (data) => html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;

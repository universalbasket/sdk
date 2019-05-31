import landlineCheck from '../inputs/landline-check';
import landlineOption from '../inputs/landline-options';

import { html } from '../../../src/lit-html';

export default (name, data = {}) => html`
    ${landlineCheck()}
    ${data.landlineOption ? hidden(data.landlineOption) : landlineOption() }

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
    </div>
`;

const hidden = (data) => html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;

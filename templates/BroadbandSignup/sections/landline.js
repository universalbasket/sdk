import landlineCheck from '../inputs/landline-check';
import landlineOption from '../inputs/landline-options';

import { html } from '../../../src/lit-html';

export default (predefinedInputs = {}) => html`
    ${landlineCheck()}
    ${predefinedInputs.landlineOption ? hidden(predefinedInputs.landlineOption) : landlineOption() }
    <button type="button" class="button button--right button--primary" id="submit-landline">Submit</button>
`;

const hidden = (data) => html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;

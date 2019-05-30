import contactPerson from '../inputs/contact-person';
import account from '../../Generic/Account';
import installation from '../inputs/installation';

import { html } from '../../../src/lit-html';

export default (predefinedInputs = {}) => html`
    ${contactPerson()}
    ${account()}
    ${installation()}
    <button type="button" class="button button--right button--primary" id="submit-about-you">Continue</button>
`;

import contactPerson from '../inputs/contact-person';
import account from '../../Generic/Account';
import installation from '../inputs/installation';

import { html } from '../../../src/lit-html';

export default (name, data = {}) => html`
    ${contactPerson()}
    ${account()}
    ${installation()}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
    </div>
`;

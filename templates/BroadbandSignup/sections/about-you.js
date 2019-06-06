import contactPerson from '../inputs/contact-person.js';
import account from '../../Generic/Account.js';
import installation from '../inputs/installation.js';

import { html } from '/web_modules/lit-html/lit-html.js';

export default (name, data = {}) => html`
    ${contactPerson()}
    ${account()}
    ${installation()}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;

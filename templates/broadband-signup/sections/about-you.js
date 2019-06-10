import { html } from '/web_modules/lit-html/lit-html.js';

import { contactPerson, selectedMarketingContactOptions } from '../inputs/index.js';
import account from '../../generic/account.js';

export default (name, _data = {}) => html`
    ${contactPerson()}
    ${account()}
    ${selectedMarketingContactOptions()}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;

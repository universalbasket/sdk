import { html } from '/src/main.js';

import { ContactPerson, SelectedMarketingContactOptions } from '../inputs/index.js';
import Account from '../../generic/account.js';

export default (name, _data = {}) => html`
    ${ContactPerson()}
    ${Account()}
    ${SelectedMarketingContactOptions()}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;

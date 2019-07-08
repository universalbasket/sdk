import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

import { ContactPerson, SelectedMarketingContactOptions } from '../inputs/index.js';
import Account from '../../generic/account.js';

export default function aboutYou(name, _data = {}) {
    return render(html`
        ${ContactPerson()}
        ${Account()}
        ${SelectedMarketingContactOptions()}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

import { html } from '/web_modules/lit-html.js';
import { owner, account } from '../inputs/index.js';

export default (name, data) => html`
    ${account()}
    ${owner()}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look up</button>
    </div>
`;

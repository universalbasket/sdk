import { installation } from '../inputs/index.js';

import { html } from '/web_modules/lit-html/lit-html.js';

export default (name, data) => {
    return html`
        ${installation(data.installationOptions)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>`
};

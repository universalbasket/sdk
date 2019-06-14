import { html } from '/src/main.js';

import { installation } from '../inputs/index.js';

export default (name, data) => {
    return html`
        ${installation(data.installationOptions)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>`;
};

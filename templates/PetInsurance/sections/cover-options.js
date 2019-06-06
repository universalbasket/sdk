import { html } from '/web_modules/lit-html.js';
import { selectedCoverOptions } from '../inputs/index.js';

export default (name, { availableCoverOptions }) => html`
    ${selectedCoverOptions(availableCoverOptions)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;

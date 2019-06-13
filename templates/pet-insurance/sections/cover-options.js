import { html } from '/src/main.js';
import { selectedCoverOptions } from '../inputs/index.js';

export default (name, { availableCoverOptions }) => html`
    ${selectedCoverOptions(availableCoverOptions)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;

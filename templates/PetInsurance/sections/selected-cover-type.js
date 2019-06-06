import { html } from '/web_modules/lit-html/lit-html.js';
import { selectedCoverType } from '../inputs/index.js';

export default (name, { availableCoverTypes }) => html`
    ${selectedCoverType(availableCoverTypes)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Select</button>
    </div>
`;

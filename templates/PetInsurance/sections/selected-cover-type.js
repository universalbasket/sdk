import { html } from '/web_modules/lit-html.js';
import { selectedCoverType } from '../inputs/index.js';

export default (name, { availableCoverTypes }, skip) => html`
    ${selectedCoverType(availableCoverTypes)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Select</button>
        <button type="button" class="button button--right" id="skip-btn-${name}" @click="${skip}">skip(dev)</button>
    </div>
`;

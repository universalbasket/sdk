import { html } from '/web_modules/lit-html/lit-html.js';
import { selectedAddress } from '../inputs/index.js';

export default (name, { availableAddresses }) => html`
    ${selectedAddress(availableAddresses)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">continue</button>
    </div>
`;

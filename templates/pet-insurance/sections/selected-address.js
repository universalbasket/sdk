import { html } from '/src/main.js';
import { selectedAddress } from '../inputs/index.js';

export default (name, { availableAddresses }, skip) => {
    if (availableAddresses == null) {
        return skip();
    }

    return html`
        ${selectedAddress(availableAddresses)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">continue</button>
        </div>
    `;
};

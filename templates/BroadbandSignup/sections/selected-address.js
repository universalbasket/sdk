import selectedAddress from '../inputs/selected-address';
import { html } from 'lit-html';

export default (name, data) => html`
    ${selectedAddress(data.availableAddresses)}
    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

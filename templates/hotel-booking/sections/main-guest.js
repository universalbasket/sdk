import { html } from '/src/main.js';
import { MainGuest } from '../inputs/index.js';

// https://protocol.automationcloud.net/HotelBooking#MainGuest
export default name => html`
    <h2>Main guest details</h2>
    ${MainGuest()}

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Submit</button>
    </div>
`;

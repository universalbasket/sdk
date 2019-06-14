import { html } from '/src/main.js';
import { selectedBroadbandSetupDate } from '../inputs/index.js';

export default (name, data) => html`
    ${data.availableBroadbandSetupDates ? selectedBroadbandSetupDate(data.availableBroadbandSetupDates) : '' }

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

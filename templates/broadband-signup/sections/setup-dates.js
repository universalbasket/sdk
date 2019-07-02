import { html } from '/src/main.js';
import { SelectedBroadbandSetupDate } from '../inputs/index.js';

export default (name, data) => html`
    ${data.availableBroadbandSetupDates ? SelectedBroadbandSetupDate(data.availableBroadbandSetupDates) : '' }

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

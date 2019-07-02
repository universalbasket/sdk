import { html } from '/src/main.js';
import { SelectedBroadbandSetupDate, SelectedTvSetupDate } from '../inputs/index.js';

export default (name, { availableTvSetupDates, availableBroadbandSetupDates }) => html`
    ${availableBroadbandSetupDates ? SelectedBroadbandSetupDate(availableBroadbandSetupDates) : '' }
    ${availableTvSetupDates ? SelectedTvSetupDate(availableTvSetupDates) : '' }

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

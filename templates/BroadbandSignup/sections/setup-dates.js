import { html } from '/web_modules/lit-html/lit-html.js';
import { selectedBroadbandSetupDate, selectedTvSetupDate } from '../inputs/index.js';

export default (name, data) => html`
    ${data.availableBroadbandSetupDates ? selectedBroadbandSetupDate(data.availableBroadbandSetupDates) : '' }

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

import { html } from 'lit-html';
import { selectedBroadbandSetupDate, selectedTvSetupDate } from '../inputs/index';

export default (name, data) => html`
    ${data.availableBroadbandSetupDates ? selectedBroadbandSetupDate(data.availableBroadbandSetupDates) : '' }

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Continue</button>
    </div>
`;

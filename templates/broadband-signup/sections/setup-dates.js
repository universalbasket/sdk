import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedBroadbandSetupDate, SelectedTvSetupDate } from '../inputs/index.js';

export default function setupDates({ name, data: { availableTvSetupDates, availableBroadbandSetupDates } }) {
    return render(html`
        ${availableBroadbandSetupDates ? SelectedBroadbandSetupDate(availableBroadbandSetupDates) : '' }
        ${availableTvSetupDates ? SelectedTvSetupDate(availableTvSetupDates) : '' }

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

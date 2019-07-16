import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedBroadbandSetupDate } from '../inputs/index.js';

export default function setupDates(name, { availableBroadbandSetupDates }) {
    return render(html`
        ${availableBroadbandSetupDates ? SelectedBroadbandSetupDate(availableBroadbandSetupDates) : '' }

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

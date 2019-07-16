import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedPackage } from '../inputs/index.js';

export default function packages(name, { availableBroadbandPackages, availableBroadbandExtras, availablePhonePackages, availablePhoneExtras }) {
    return render(html`
        ${SelectedPackage('Select your broadband package', 'selectedBroadbandPackage', availableBroadbandPackages)}
        ${SelectedPackage('Select your broadband extras', 'selectedBroadbandExtras', availableBroadbandExtras, false, true)}
        ${SelectedPackage('Select your phone package', 'selectedPhonePackage', availablePhonePackages, true)}
        ${SelectedPackage('Select your phone extras', 'selectedPhoneExtras', availablePhoneExtras, false, true)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

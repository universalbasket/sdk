import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedPackage } from '../inputs/index.js';

export default function packages(name, { availableTvPackages, availableTvExtras }) {
    return render(html`
        ${SelectedPackage('Select your TV package', 'selectedTvPackage', availableTvPackages)}
        ${SelectedPackage('Select your TV extras', 'selectedTvExtras', availableTvExtras, false, true)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

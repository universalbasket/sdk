import { html } from '/web_modules/lit-html/lit-html.js';

export default function selectedTvSetupDate(availableDates) {
    return html`
        <div class="field">
            <span class="field__name">When do you want your TV package set up?</span>
            <select
                name="selected-tv-setup-date-$object"
                required>
                <option>select date...</option>
                ${ availableDates.map(data => html`<option value="${JSON.stringify(data)}"> ${data.date}</option>`) }
            </select>
        </div>
    `;
}

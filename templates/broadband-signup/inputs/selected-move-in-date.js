import { html } from '/web_modules/lit-html/lit-html.js';

export default function selectedMoveInDate(availableDates) {
    return html`
        <div class="field">
            <span class="field__name">When are you going to move in?</span>
            <select name="selected-move-in-date" required>
                <option>select date...</option>
                ${ availableDates.map(date => html`<option value="${date}"> ${date}</option>`) }
            </select>
        </div>
    `;
}

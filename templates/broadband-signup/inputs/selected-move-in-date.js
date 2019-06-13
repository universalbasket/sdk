import { html } from '/src/main.js';

export default availableDates => html`
    <div class="field">
        <span class="field__name">When are you going to move in?</span>
        <select name="selected-move-in-date" required>
            <option>select date...</option>
            ${ availableDates.map(date => html`<option value="${date}"> ${date}</option>`) }
        </select>
    </div>
`;

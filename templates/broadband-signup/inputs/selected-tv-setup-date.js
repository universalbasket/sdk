import { html } from '/src/main.js';

export default availableDates => html`
    <div class="field">
        <span class="field__name">When do you want your TV package set up?</span>
        <select name="selected-tv-setup-date-$object" required>
            <option>select date...</option>
            ${ availableDates.map(data => html`<option value="${data.date}"> ${data.date}</option>`) }
        </select>
    </div>
`;

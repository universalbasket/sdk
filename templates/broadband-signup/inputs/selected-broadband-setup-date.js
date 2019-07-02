import { html } from '/src/main.js';

export default availableDates => html`
    <div class="field">
        <span class="field__name">When do you want your broadband set up?</span>
        <select
            name="selected-broadband-setup-date-$object"
            required>
            <option>select date...</option>
            ${ availableDates.map(data => html`<option value="${JSON.stringify(data)}">${data.date}</option>`) }
        </select>
    </div>
`;

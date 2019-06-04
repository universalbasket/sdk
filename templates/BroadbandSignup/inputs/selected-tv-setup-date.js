import { html } from 'lit-html';

export default (availableDates) => html`
    <div class="field">
        <span class="field__name">When do you want your TV package set up?</span>
        <select name="selected-tv-setup-date" required>
            <option>select date...</option>
            ${ availableDates.map(date => html`
                <option value="${date}"> ${date}</option>`
            )}
        </select>
    </div>
`;

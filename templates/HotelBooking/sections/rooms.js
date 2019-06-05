import { html, render } from 'lit-html';

export default (name, { availableRooms }) => {
    return html`
        <div class="field field-set">
            <span class="field__name">Select room</span>
            <select name="selected-rooms-$object[]" required>
                <option>select room...</option>
                ${ availableRooms.map(room => html`
                    <option value="${JSON.stringify(room)}">${room.type} – ${room.price.value/100} ${room.price.currencyCode.toUpperCase()}</option>`
                )}
            </select>
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

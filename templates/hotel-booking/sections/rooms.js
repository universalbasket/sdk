import { html, templates } from '/src/main.js';

function valueLi(code) {
    switch (code) {
        case 'pay-later': return html`<li>Pay later</li>`;
        case 'free-breakfast': return html`<li>Breakfast included</li>`;
        case 'free-internet': return html`<li>Wi-fi</li>`;
        default: return html`<li>${ code }</li>`;
    }
}

export default (name, { availableRooms }) => {
    return html`
        <div class="field field--room">
            ${ availableRooms.map(room => html`
                <div class="room">
                    <div class="room__img"></div>
                    <div class="room__details">
                        <ul class="dim">
                            <li><b>${ room.type }</b></li>
                            ${ room.valueAdditions.map(valueLi) }
                        </ul>
                        <div class="room__price">
                            <b>${ templates.priceDisplay(room.price) }</b>
                        </div>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="selected-rooms-$object[]"
                            id="selected-rooms-$object[]-${room.type + room.price.value}"
                            value="${JSON.stringify(room)}"
                            required />
                        <label
                            for="selected-rooms-$object[]-${room.type + room.price.value}"
                            class="button">
                            Select
                        </label>
                    </div>
                </div>
            `) }
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

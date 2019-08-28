import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';

function valueLi(code) {
    switch (code) {
        case 'pay-later': return html`<li>Pay later</li>`;
        case 'free-breakfast': return html`<li>Breakfast included</li>`;
        case 'free-internet': return html`<li>Wi-fi</li>`;
        default: return html`<li>${ code }</li>`;
    }
}

export default function rooms({ name, storage }) {
    const availableRooms = storage.get('output', 'availableRooms');

    return render(html`
        <div class="field field--list" data-error="Please select a room">
            <span class="field__name">Select a room</span>
            ${ availableRooms.map((room, i) => html`
                <div class="field-item field-item--room">
                    <div class="field-item__img"></div>
                    <div class="field-item__details">
                        <ul class="dim">
                            <li><b>${ room.type }</b></li>
                            ${ room.valueAdditions.map(valueLi) }
                        </ul>
                        <div class="field-item__price">
                            <b>${ templates.priceDisplay(room.price) }</b>
                        </div>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="selected-rooms-$object[]"
                            id="${ room.price.value + '_' + i }"
                            value="${ JSON.stringify(room) }"
                            required />
                        <label
                            for="${ room.price.value + '_' + i}"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${ name }">Continue</button>
        </div>
    `);
}

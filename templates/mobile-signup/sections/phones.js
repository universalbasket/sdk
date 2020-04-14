
import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';
import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

function colourLi(phone, colour) {
    return html`<li><label><input type="radio" name="selectedPhoneOption[colour]" value="${colour}"> ${colour}</label></li>`;
}

export default function landline({ name, storage }) {
    const availablePhoneOffers = storage.get('output', 'availablePhoneOffers') || storage.get('cache', 'availablePhoneOffers');

    return render(html`
        <div class="field field--list" data-error="Please select a phone">
            <span class="field__name">Select a phone</span>
            ${ availablePhoneOffers.map((phone, i) => html`
                <div class="field-item field-item--room">
                    <div class="field-item__img">
                        <img src="${phone.image}" width="74">
                    </div>
                    <div class="field-item__details">
                        <ul class="dim">
                            <li><b>${ phone.name }</b></li>
                            ${ phone.colour.map(colour => colourLi(phone, colour)) }
                        </ul>
                        <div class="field-item__price">
                            <b>from ${ templates.priceDisplay(phone.priceFrom) }</b>
                        </div>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="selectedPhoneOption[name]"
                            id="${ phone.priceFrom.value + '_' + i }"
                            value="${ phone.name }"
                            required />
                        <label
                            for="${ phone.priceFrom.value + '_' + i}"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Confirm</button>
        </div>
    `);
}
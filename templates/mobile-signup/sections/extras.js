
import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';
import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

function textLi(text) {
    return html`<li>${text}</li>`;
}

export default function landline({ name, storage }) {
    const availablePlanExtras = storage.get('output', 'availablePlanExtras') || storage.get('cache', 'availablePlanExtras');

    return render(html`
        <div class="field field--list" data-error="Please select some plan extras">
            <span class="field__name">Select your plan extras</span>
            ${ availablePlanExtras.map((extra, i) => html`
                <div class="field-item>
                    <div class="field-item__details">
                        <ul class="dim">
                            <li><b>${ extra.name }</b></li>
                            ${ extra.description.map(textLi) }
                        </ul>
                        <div class="field-item__price">
                            <b>${ templates.priceDisplay(extra.price) } per month</b>
                        </div>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="checkbox"
                            name="selectedPlanExtras-$object[]"
                            id="${ extra.name + '_' + i }"
                            value="${ JSON.stringify(extra) }" />
                        <label
                            for="${ extra.name + '_' + i}"
                            class="button">Select</label>
                    </div>
                </div>
                <hr>
            `) }
        </div>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Confirm</button>
        </div>
    `);
}
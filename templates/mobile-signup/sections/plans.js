
import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';
import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

function textLi(text) {
    return html`<li>${text}</li>`;
}

export default function landline({ name, storage }) {
    const availableMobilePlans = storage.get('output', 'availableMobilePlans') || storage.get('cache', 'availableMobilePlans');

    return render(html`
        <div class="field field--list" data-error="Please select a plan">
            <span class="field__name">Select your plan</span>
            ${ availableMobilePlans.map((plan, i) => html`
                <div class="field-item>
                    <div class="field-item__details">
                        <ul class="dim">
                            <li><b>${ plan.name }</b></li>
                            ${ plan.description.map(textLi) }
                        </ul>
                        <div class="field-item__price">
                            <b>${ templates.priceDisplay(plan.price) } per month</b>
                        </div>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="selectedMobilePlan-$object"
                            id="${ plan.name + '_' + i }"
                            value="${ JSON.stringify(plan) }"
                            required />
                        <label
                            for="${ plan.name + '_' + i}"
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
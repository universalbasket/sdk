
import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';
import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

function textLi(text) {
    return html`<li>${text}</li>`;
}

export default function landline({ name, storage }) {
    const availableBenefits = storage.get('output', 'availableBenefits') || storage.get('cache', 'availableBenefits');

    return render(html`
        <div class="field field--list" data-error="Please select TWO plan benefits">
            <span class="field__name">Select TWO benefits</span>
            ${ availableBenefits.map((benefit, i) => html`
                <div class="field-item>
                    <div class="field-item__details">
                        <ul class="dim">
                            <li><b>${ benefit.name }</b></li>
                            ${ benefit.description.map(textLi) }
                        </ul>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="checkbox"
                            name="selectedBenefits-$object[]"
                            id="${ benefit.name + '_' + i }"
                            value="${ JSON.stringify(benefit) }" />
                        <label
                            for="${ benefit.name + '_' + i}"
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
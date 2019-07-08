import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';

const key = 'selected-cover-type';

export default function selectedCoverType(outputs) {
    return html`
        <div class="field field--list">
            <span class="field__name">Available Cover Type</span>
            ${ outputs.map(optionObj => html`
                <div class="field-item field-item--select-one">
                    <div class="field-item__details">
                        ${ optionObj.coverName }
                        –
                        ${ templates.priceDisplay(optionObj.price) }
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            id="${ key }-${ optionObj.coverName }"
                            name="${ key }-$object"
                            value="${ JSON.stringify(optionObj) }"
                            required />
                        <label
                            for="${ key }-${ optionObj.coverName }"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>
    `;
}

import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';

function showCoverOptions(key) {
    document.querySelector(`#${key}-options-list`).style.display = 'block';
    document.querySelector(`#${key}-option-null`).checked = false;
    console.info(`#${key}-options-list`, document.querySelector(`#${key}-options-list`));
}

function hideCoverOptions(key) {
    document.querySelector(`#${key}-options-list`).style.display = 'none';
    document.querySelector(`#${key}-option-null`).checked = true;
}

export default function selectedPolicyOption(name, key, output) {
    if (!output) {
        return '';
    }

    return html`
    <div class="field">
        <span class="field__name">${name}</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="_${key}-$object"
                id="${key}-yes"
                @click="${ () => showCoverOptions(key) }"
                required />
            <label
                for="${key}-yes"
                class="button">Show cover options</label>

            <input
                type="radio"
                name="_${key}-$object"
                id="${key}-no"
                checked
                @click="${ () => hideCoverOptions(key) }" />
            <label
                for="${key}-no"
                    class="button">No thanks</label>
        </div>

        <div
            id="${key}-options-list"
            style="display: none; margin-top: 10px;"
            class="field__inputs group group--merged">
        <input
            type="radio"
            id="${key}-option-null"
            name="${ key }-$object"
            value="null"
            checked
            style="display: none;"
            required />
            ${ output.map((o, i) => html`
                <div class="field-item field-item--select-one">
                    <div class="field-item__details">
                        <strong>${o.name}</strong>
                        <span
                            @click=${ () => templates.modal(html`${ o.details.contents.map(templates.markup) }`, { title: o.details.name }).show() }
                            class="clickable">more info</span>
                        <br>
                        ${o.priceLine}
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            id="${key}-option-${i}"
                            name="${ key }-$object"
                            value="${ JSON.stringify(o) }"
                            required />
                        <label
                            for="${key}-option-${i}"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>
    </div>
    `;
}

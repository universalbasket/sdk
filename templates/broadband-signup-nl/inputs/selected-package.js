import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';

function deselect(key) {
    document.querySelector(`#${key}-option-null`).checked = true;
}

function checkHiddenPackages(p) {
    if (p.metadata && p.metadata.hide) {
        const checkbox = document.querySelector(`[data-id=${p.metadata.id}] input[type=checkbox]`);
        p.metadata.hide.forEach(h => {
            const el = document.querySelector(`[data-id=${h}]`);
            if (el) {
                const elC = el.querySelector('input[type=checkbox]');
                if (checkbox.checked) {
                    el.classList.add('field-item-disabled');
                    elC.checked = false;
                    elC.disabled = true;
                } else {
                    el.classList.remove('field-item-disabled');
                    elC.disabled = false;
                }
            }
        });
    }
}

export default function selectedPackage(name, key, output, optional, multi) {
    if (!output || output.length === 0) {
        return '';
    }

    return html`
    <div class="field">
        <span class="field__name">
            ${name}
            ${ optional ? html`<a style="font-size: 0.8em; font-weight: normal;" @click="${ () => deselect(key) }">(Remove)</a>` : '' }
        </span>
        <div
            id="${key}-options-list"
            style="display: block;"
            class="field__inputs group">
            ${ (!multi && optional) ? html`
                <input
                    type="radio"
                    id="${key}-option-null"
                    name="${ key }-$object"
                    value="null"
                    checked
                    style="display: none;" />
                ` : '' }
            ${ output.map((o, i) => html`
                <div class="field-item field-item--select-one" data-id="${ o.metadata && o.metadata.id }">
                    <div class="field-item__details">
                        <strong>${o.name}</strong>
                        ${ templates.priceDisplay(o.price) }

                        <ul style="list-style: square; margin-left: 1.5em;">
                            ${ o.description.contents.map(c => html`
                                <li style="font-size: 0.8em;">${c.text}</li>
                            `) }
                        </ul>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="${ multi ? 'checkbox' : 'radio' }"
                            id="${key}-option-${i}"
                            name="${ key }-$object${multi ? '[]' : ''}"
                            @click="${ () => checkHiddenPackages(o) }"
                            value="${ JSON.stringify(o) }"
                            ?checked=${ !multi && !optional && i === 0 }
                            ?required=${!multi} />
                        <label
                            for="${key}-option-${i}"
                            class="button">${ multi ? 'Add' : 'Select' }</label>
                        <br>
                        ${ o.image ? html`
                            <img
                                style="margin-top: 15px;"
                                width="100"
                                src="${ o.image }" />
                            ` : '' }
                    </div>
                </div>
            `) }
        </div>
    </div>
    `;
}

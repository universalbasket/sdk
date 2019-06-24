import { html, templates } from '/src/main.js';

export default (name, key, output) => {
    if (!output) {
        return '';
    }

    return html`
    <div class="field">
        <span class="field__name">${name}</span>
        <div class="field__inputs group group--merged">
            <input
                type="radio"
                name="_${key}-options"
                id="${key}-yes"
                value=""
                required
                onclick="document.querySelector('#${key}-options-list').style.display = 'block';  document.querySelector('#${key}-option-null').checked = false;"
                />
            <label for="${key}-yes" class="button">Show cover options</label>

            <input
                type="radio"
                name="_${key}-options"
                id="${key}-no"
                value=""
                checked
                onclick="document.querySelector('#${key}-options-list').style.display = 'none'; document.querySelector('#${key}-option-null').checked = true;"
                />
            <label for="${key}-no" class="button">No thanks</label>
        </div>

        <div id="${key}-options-list" style="display: none; margin-top: 10px;" class="field__inputs group group--merged">
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
                        (<a href="#">more info</a>)
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
    `
};

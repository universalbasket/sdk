import { html } from '/web_modules/lit-html/lit-html.js';
const key = 'selected-cover-options';

export default (output) => {
    return html`
    <div id="${key}">
        <div class="field field-set">
            <span class="field__name">Select Covers</span>
            ${ output.map(o => html`
            <input type="checkbox" value="${JSON.stringify(o)}" name="${key}-$object[]" id="${key}-${o.name}"/>
            <label for="${key}-${o.name}" class="button">
                <div>
                    <b>${o.name}</b>
                    <pre>${o.detail}</pre>
                    <p>${(o.price.value * 0.01).toFixed(2)} ${o.price.currencyCode}</p>
                </div>
            </label>`
                )}
        </div>
    </div>
`};

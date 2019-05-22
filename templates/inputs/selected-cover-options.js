import { html } from '../../src/lit-html';

export default (meta, output) => {
    return html`
    <div id="${meta.key}">
        <div class="field field-set">
            <span class="field__name">${meta.title || meta.key}</span>
            ${ output.map(o => html`
            <input type="checkbox" value="${JSON.stringify(o)}" name="${meta.key}-$object[]" id="${meta.key}-${o.name}"/>
            <label for="${meta.key}-${o.name}" class="button">
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

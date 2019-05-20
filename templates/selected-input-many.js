import { html } from '../src/lit-html';

export default (meta, output) => {
    return html`
    <div id="${meta.key}">
        <div class="field field-set">
            <span class="field__name">${meta.title || meta.key}</span>
            <select name="${meta.key}">
                ${ output.map(o => html`
                    <option value="${o}"> ${o}</option>`
                )}
            </select>
        </div>
    </div>
`};
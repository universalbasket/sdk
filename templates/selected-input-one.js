import kebabCase from 'lodash.kebabcase';
import { html } from '../src/lit-html';

export default (meta, output) => {
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <select name="${kebabCase(meta.key)}">
            ${ output.map(o => html`
                <option value="${o}"> ${o}</option>`
            )}
        </select>
    </div>
`};

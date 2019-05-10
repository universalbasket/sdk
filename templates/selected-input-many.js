import kebabCase from 'lodash.kebabcase';
import { html, render } from '../src/lit-html';
import getOutput from '../src/get-output';

const field = (fieldName, inputKey, output) => html`
<div class="field field-set">
    <span class="field__name">${fieldName || inputKey}</span>
    <select name="${inputKey}">
        ${ output.map(output => html`
            <option value="${output}"> ${output}</option>`
        )}
    </select>
</div>
`;

export default (meta) => {
    init(meta);
    return html`
    <div id="${meta.key}">
        <p>please wait...</p>
    </div>
`};

function init(meta) {
    const { sourceOutputKey } = meta;
    getOutput(sourceOutputKey, (err, output) => {
        if (err) {
            return;
        }
        render(field(meta.title, kebabCase(meta.key), output), document.querySelector(`#${meta.key}`));
    })
}
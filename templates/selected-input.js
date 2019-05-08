import kebabCase from 'lodash.kebabcase';
import { html, render } from '../src/lit-html';
import getOutput from '../src/get-output';

const field = (fieldName, inputKey, output) => html`
<div class="field">
    <span class="field__name">${fieldName}</span>
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
    <div id="${meta.inputKey}">
        <p>please wait...</p>
    </div>
`};

function init(meta) {
    const { inputMethod, sourceOutputKey } = meta;
    getOutput({inputMethod,  sourceOutputKey}, (err, output) => {
        if (err) {
            return;
        }
        render(field(meta.title, kebabCase(meta.inputKey), output), document.querySelector(`#${meta.inputKey}`));
    })
}
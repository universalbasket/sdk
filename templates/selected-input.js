import { html } from '../src/lit-html';

const render = (fieldName, inputKey, output) => html`
<div class="field">
    <span class="field__name">${fieldName}</span>
    <select name="${inputKey}">
        ${ output.map(output => html`
            <option value="${output}"> ${output}</option>`
        )}
    </select>
</div>
`;

export default (fieldName, inputKey, output) => html`
    ${output && Array.isArray(output) ?
        render(fieldName, inputKey, output) :
        ''
    }
`;

import kebabCase from 'lodash.kebabcase';
import { html, render } from '../../src/lit-html';
import getOutput from '../../src/get-output';

const field = (inputKey, options) => html`
<div class="field field-set">
    <div class="field__inputs group group--merged">
    ${options.map(optionObj => html`
        <input type="radio" id="${inputKey}" name="${inputKey}-$object" value="${JSON.stringify(optionObj)}">
        <label for="${inputKey}" class="button">
            <div><b>${optionObj.coverName}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
        </label>`
    )}
    </div>
</div>
`;

export default (meta) => {
    init(meta);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.inputKey}</span>
        <div id="${meta.key}">
            <p>please wait...</p>
        </div>
    </div>
`};

function init(meta) {
    const {sourceOutputKey } = meta;
    getOutput(sourceOutputKey, (err, output) => {
        if (err) {
            return;
        }
        render(field(kebabCase(meta.key), output), document.querySelector(`#${meta.key}`));
    })
}
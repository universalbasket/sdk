import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';
const field = (inputKey, options) => html`
<div class="field field-set">
    <div class="field__inputs group group--merged">
    ${options.map(optionObj => html`
        <input type="radio" id="${inputKey}" name="${inputKey}-$object" value="${JSON.stringify(optionObj)}">
        <label for="${inputKey}" class="button">
            <div><b>${optionObj.text}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
        </label>`
    )}
    </div>
</div>
`;

export default (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.inputKey}</span>
        <div class="field__inputs group group--merged">
            ${output.map(optionObj => html`
                <input type="radio" id="${key}" name="${key}-$object" value="${JSON.stringify(optionObj)}">
                <label for="${key}" class="button">
                    <div><b>${optionObj.text}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
                </label>`
            )}
            </div>
    </div>
`};

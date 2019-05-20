import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';

export default (meta, output) => {
    console.log(meta, output);
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        ${output.map(optionObj => html`
            <input type="radio" id="${key}-${optionObj.coverName}" name="${key}-$object" value="${JSON.stringify(optionObj)}">
            <label for="${key}-${optionObj.coverName}" class="button">
                <div><b>${optionObj.coverName}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
            </label>`
        )}
    </div>
`};

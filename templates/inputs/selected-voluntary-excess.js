import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';

export default (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <div class="field__inputs group group--merged">
        ${output.map(optionObj => html`
            <input type="radio" id="${key}" name="${key}-$object" value="${JSON.stringify(optionObj)}">
            <label for="${key}" class="button">
                <div><b>${optionObj.name}</b>
                <pre>${optionObj.details}</pre>
                <p>${optionObj.priceLine}</p></div>
            </label>`
        )}
        </div>
    </div>
`};

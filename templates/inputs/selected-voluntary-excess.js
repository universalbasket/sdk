import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';

export default (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <div class="field__inputs group group--merged">
        ${output.map(optionObj => html`
        <div>
            <input
                type="radio"
                id="${key}-${optionObj.priceLine}"
                name="${key}-$object"
                value="${JSON.stringify(optionObj)}">

            <label for="${key}-${optionObj.priceLine}" class="button">
                <div>
                    <b>${optionObj.name}</b>
                    <pre>${optionObj.details}</pre>
                </div>
            </label>
            <p>${optionObj.priceLine}</p>
        </div>
            `
        )}
        </div>
    </div>
`};

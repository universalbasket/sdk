import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';

export default (outputs) => html`
    <div class="field field-set">
        <span class="field__name">Available Cover Type</span>
        ${outputs.map(optionObj => html`
            <input
                type="radio"
                id="${key}-${optionObj.coverName}"
                name="${key}-$object"
                value="${JSON.stringify(optionObj)}">

            <label for="${key}-${optionObj.coverName}" class="button">
                <div><b>${optionObj.coverName}</b> <p>${(optionObj.price.value * 0.01).toFixed(2)} ${optionObj.price.currencyCode}</p></div>
            </label>`
        )}
    </div>
`;

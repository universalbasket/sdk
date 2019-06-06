import { html } from '/web_modules/lit-html/lit-html.js';

const key = 'selected-cover-type';
export default (outputs) => html`
    <div class="field field-set">
        <span class="field__name">Available Cover Type</span>
        <div class="field__inputs group group--merged">
            ${outputs.map(optionObj => html`
                <input
                    type="radio"
                    id="${key}-${optionObj.coverName}"
                    name="${key}-$object"
                    value="${JSON.stringify(optionObj)}">

                <label for="${key}-${optionObj.coverName}" class="field__name">
                    <div>
                        <b>${optionObj.coverName}</b>
                        <p>${(optionObj.price.value * 0.01).toFixed(2)} ${optionObj.price.currencyCode}</p>
                    </div>
                </label>`
            )}
        </div>
    </div>
`;

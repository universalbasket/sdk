import { html } from '../../src/lit-html';
const key = 'selected-voluntary-excess';

export default (output) => {
    return html`
    <div class="field field-set">
        <span class="field__name">Select voluntary excess </span>
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

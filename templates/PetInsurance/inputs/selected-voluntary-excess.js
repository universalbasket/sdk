import { html } from '/web_modules/lit-html/lit-html.js';
const key = 'selected-voluntary-excess';

export default output => html`
    <div class="field field-set">
        <span class="field__name">Select voluntary excess </span>
        <div class="field__inputs group group--merged">
        ${ output.map(optionObj => html`
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
            </div>`)}
        </div>
    </div>
`;

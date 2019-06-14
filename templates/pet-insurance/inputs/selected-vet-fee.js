import { html } from '/src/main.js';
const key = 'selected-vet-fee';

export default output => html`
    <div class="field field-set">
        <span class="field__name">Vet Fee</span>
        <div class="field__inputs group group--merged">
            ${ output.map(optionObj => html`
                <input
                    type="radio"
                    id="${key}-${optionObj.price.value}"
                    name="${key}-$object"
                    value="${JSON.stringify(optionObj)}">
                <label
                    for="${key}-${optionObj.price.value}"
                    class="button">
                    <div><b>${optionObj.text}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
                </label>`)}
            </div>
    </div>
`;

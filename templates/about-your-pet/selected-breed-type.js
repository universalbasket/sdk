import { html } from '../../src/lit-html';

const renderBreedType = (breedTypes) => html`
<div class="field">
    <span class="field__name">What is your pet's breed?</span>
    <select for="selected-breed-type" name="selected-breed-type">
        ${ breedTypes.map(b => html`
            <option for="selected-breed-type" value="${b}"/> ${b}</option>`
        )}
    </select>
</div>
`;

export default (breedTypes) => html`
    ${breedTypes && Array.isArray(breedTypes) ?
        renderBreedType(breedTypes) :
        ''
    }
`;

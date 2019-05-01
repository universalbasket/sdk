import { html } from '../../node_modules/lit-html/lit-html.js';

const renderBreedType = (breedTypes) => html`
<div class="job-input">
    <p>What is your pet's breed?</p>
    <label for="selected-breed-type"></label>
    ${ breedTypes.map(b => html`
        <label for="selected-breed-type">
            <input type="radio" name="selected-breed-type" value="${b}"/> ${b}
        </label>`
    )}
</div>
`;

export default (breedTypes) => html`
    ${breedTypes && Array.isArray(breedTypes) ?
        renderBreedType(breedTypes) :
        ''
    }
`;

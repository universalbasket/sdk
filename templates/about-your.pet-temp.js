import { html, render } from '../src/lit-html';

/* templates */
import { pets, selectedBreedType } from './inputs';

const onPetTypeChange = {
    handleEvent(e) {
        updateBreedTypes(e.target.value);
    }
};

const template = html`
<div class="section">
    <h3 class="section__header">About your pet</h3>
    <form class="section__body" id="about-your-pet">
        ${pets()}
        ${selectedBreedType()}
    </form>

    <button type="button" class="button button--right button--primary" id="submit-about-your-pet">Continue</button>
</div>
`

// those value should come from previous-input-output
const MORE_THAN_BREED_TYPES = {
    cat: [
        "Pedigree",
        "Non Pedigree"
    ],
    dog: [
        "Cross Breed",
        "Pedigree",
        "Small mixed breed (up to 10kg)",
        "Medium mixed breed (10 - 20kg)",
        "Large mixed breed (above 20kg)"
    ]
}

function updateBreedTypes(petType) {
    const breedTypes = MORE_THAN_BREED_TYPES[petType];
    render(selectedBreedType(breedTypes), document.querySelector('#breedType'));
}

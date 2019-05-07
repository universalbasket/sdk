import { html, render } from '../../src/lit-html';

/* templates */
import pets from './pets';
import selectedBreedType from './selected-breed-type';

// this will be
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

export default () => html`
<div class="section">
    <h3 class="section__header">About your pet</h3>
    <form class="section__body" id="about-your-pet">
        ${pets(onPetTypeChange)}
        <!-- TODO<PROTOCOL>: breedType should be part of pets input!-->
        <div id="breedType"></div>
    </form>

    <button type="button" class="button button--right button--primary" id="submit-about-your-pet">Continue</button>
</div>
`
const onPetTypeChange = {
    handleEvent(e) {
        updateBreedTypes(e.target.value);
    }
};

function updateBreedTypes(petType) {
    const breedTypes = MORE_THAN_BREED_TYPES[petType];
    render(selectedBreedType(breedTypes), document.querySelector('#breedType'));
}

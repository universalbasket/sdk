import { html, render } from '../../node_modules/lit-html/lit-html.js';

/* templates */
import pets from './pets';
import selectedBreedType from './selected-breed-type';

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
<div>
    <h3>About your pet</h3>
    <form id="about-your-pet">
        ${pets(onPetTypeChange)}
        <!-- TODO<PROTOCOL>: breedType should be part of pets input!-->
        <div id="breedType"></div>
    </form>

    <button type="button" id="submit-about-your-pet">Next</button>
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
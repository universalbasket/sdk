import { html } from '../node_modules/lit-html/lit-html.js';

export default () => html`
<div class="job-input">
    <form id="pets">Pets
        <div class="pet" name="pets[0]">
            <label for="pets[0][pet-name]">Name</label>
            <input type="string" name="pets[0][pet-name]" placeholder="Rex" value="Rex" required/>

            <label for="pets[0][pet-type]">Type
                <input type="radio" name="pets[0][pet-type]" value="dog" checked>Dog
                <input type="radio" name="pets[0][pet-type]" value="cat">Cat
            </label>


            <label for="pets[0][pet-gender]">Gender</label>
            <input type="radio" name="pets[0][pet-gender]" value="male" required checked>Male
            <input type="radio" name="pets[0][pet-gender]" value="female">Female

            <label for="pets[0][breed-name]">Breed Name</label>
            <input type="string" name="pets[0][breed-name]" value="Maltese" required>

            <label for="pets[0][pet-date-of-birth]">Date Of Birth</label>
            <input type="date" name="pets[0][date-of-birth]" value="2019-04-02" required>

            <label for="pets[0][pet-price]">How much did you pay or donate</label>
            <input type="number" name="pets[0][pet-price]" value="0">

            <div class="pet-related-questions">
                <label for="pets[0][related-questions][is-spayed-or-neutered]">Is your pet spayed or neutered?</label>
                <input type="radio" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]" value="false"> No

                <label for="pets[0][related-questions][has-chip-or-tag]">Does your pet have chip or tag?</label>
                <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" value="false"> No

                <label for="pets[0][related-questions][is-kept-at-your-address]">Is your pet kept at your address?</label>
                <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" value="false"> No

                <label for="pets[0][related-questions][any-behaviour-complains]">Has your pet had any behaviour complains?</label>
                <input type="radio" name="pets[0][related-questions][any-behaviour-complains-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][any-behaviour-complains-$boolean]" value="false"> No

                <label for="pets[0][related-questions][indoor-pet]">Is your pet kept indoor?</label>
                <input type="radio" name="pets[0][related-questions][indoor-pet-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][indoor-pet-$boolean]" value="false"> No

                <label for="pets[0][related-questions][is-your-pet-healthy]">Is your pet healthy? </label>
                <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" value="true" required checked> Yes
                <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" value="false"> No
            </div>
        </div>
    </form>

    <!-- <button type="button" id="">Add pet</button> -->
    <button type="button" id="create-input-pets">Create Input</button>
</div>
`;

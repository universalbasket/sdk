import { html } from '../node_modules/lit-html/lit-html.js';
const headerString = 'About your pet';

export default () => html`
<div class="job-input">
    <div class="flow-header">
        <span>${headerString}</span>
    </div>
    <form id="pets">
        <div class="pet" name="pets[0]">
            <div class="field">
                <label for="pets[0][pet-name]">Name</label>
                <input type="string" name="pets[0][pet-name]" placeholder="Rex" value="Rex" required/>
            </div>

            <div class="field">
                <p class="field-name">Pet type</p>
                <label for="pets[0][pet-type]-dog" class="field-label">
                    <input
                        type="radio"
                        name="pets[0][pet-type]"
                        id="pets[0][pet-type]-dog"
                        value="dog" checked/>Dog
                </label>
                <label for="pets[0][pet-type]-cat" class="field-label">
                    <input
                        type="radio"
                        name="pets[0][pet-type]"
                        id="pets[0][pet-type]-cat"
                        value="cat" />Cat
                </label>
            </div>

            <div class="field">
                <label for="pets[0][pet-gender]-female">Gender</label>
                <input type="radio" name="pets[0][pet-gender]" value="male" required checked id="pets[0][pet-gender]-male">Male
                <input type="radio" name="pets[0][pet-gender]" id="pets[0][pet-gender]-female" value="female">Female

            <div class="field">
                <label for="pets[0][breed-name]">Breed Name</label>
                <input type="string" name="pets[0][breed-name]" value="Maltese" required>
            </div>

            <div class="field">
                <label for="pets[0][pet-date-of-birth]">Date Of Birth</label>
                <input type="date" name="pets[0][date-of-birth]" value="2019-04-02" required>
            </div>

            <div class="field">
                <label for="pets[0][pet-price]">How much did you pay or donate</label>
                <input type="number" name="pets[0][pet-price]" value="0">
            </div>

            <div class="pet-related-questions">
                <div class="field">
                    <label for="pets[0][related-questions][is-spayed-or-neutered]">Is your pet spayed or neutered?</label>
                    <input type="radio" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]" value="false"> No
                </div>

                <div class="field">
                    <label for="pets[0][related-questions][has-chip-or-tag]">Does your pet have chip or tag?</label>
                    <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" value="false"> No
                </div>

                <div class="field">
                    <label for="pets[0][related-questions][is-kept-at-your-address]">Is your pet kept at your address?</label>
                    <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" value="false"> No
                </div>

                <div class="field">
                    <label for="pets[0][related-questions][any-behaviour-complains]">Has your pet had any behaviour complains?</label>
                    <input type="radio" name="pets[0][related-questions][any-behaviour-complains-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][any-behaviour-complains-$boolean]" value="false"> No
                </div>

                <div class="field">
                    <label for="pets[0][related-questions][indoor-pet]">Is your pet kept indoor?</label>
                    <input type="radio" name="pets[0][related-questions][indoor-pet-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][indoor-pet-$boolean]" value="false"> No
                </div>

                <div class="field">
                    <label for="pets[0][related-questions][is-your-pet-healthy]">Is your pet healthy? </label>
                    <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" value="true" required checked> Yes
                    <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" value="false"> No
                </div>
            </div>
        </div>
    </form>

    <!-- <button type="button" id="">Add pet</button> -->
    <button type="button" id="create-input-pets">Create Input</button>
</div>
`;

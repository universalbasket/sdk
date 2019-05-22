import { html } from '../../src/lit-html';

export default () => html`
<div class="job-input">
    <div class="pet" name="pets[0]">
        <div class="field field-set">
            <label class="field__name" for="pets[0][name]">Pet Name</label>
            <input type="text" name="pets[0][name]" placeholder="Rex" value="Rex" required />
        </div>

        <div class="field field-set">
            <span class="field__name">Pet type</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="pets[0][animal-type]" id="pets[0][animal-type]-dog" value="dog" required/>
                <label for="pets[0][animal-type]-dog" class="button">Dog</label>

                <input type="radio" name="pets[0][animal-type]" id="pets[0][animal-type]-cat" value="cat"/>
                <label for="pets[0][animal-type]-cat" class="button">Cat</label>
            </div>
        </div>

        <div>dog breeds select - cache.dogBreeds</div>
        <div>cat breeds select - cache.catBreeds</div>

        <div class="field field-set">
            <span class="field__name">Gender</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="pets[0][gender]" value="male" id="pets[0][gender]-male" required checked >
                <label for="pets[0][gender]-male" class="button">Male</label>

                <input type="radio" name="pets[0][gender]" id="pets[0][gender]-female" value="female">
                <label for="pets[0][gender]-female" class="button">Female</label>
            </div>
        </div>

        <div class="field field-set">
            <label  class="field__name" for="pets[0][breed-name]">Breed Name</label>
            <input type="text" name="pets[0][breed-name]" value="Afghan Hound" required>
        </div>

        <div class="field field-set">
            <label class="field__name" for="pets[0][date-of-birth]">Date Of Birth</label>
            <input type="date" name="pets[0][date-of-birth]" value="2019-01-02" minDate="${new Date()}" required>
        </div>

        <div class="field field-set">
            <label class="field__name" for="pets[0][pet-price]">How much did you pay or donate</label>
            <input type="number" name="pets[0][pet-price]" value="0" min="0">
        </div>

        <div class="pet-related-questions">
            <div class="field field-set">
                <span class="field__name">Is your pet spayed or neutered?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][is-spayed-or-neutered-$boolean]"
                        id="pets[0]-neutered-yes"
                        value="true" required checked>
                    <label
                        for="pets[0]-neutered-yes"
                        class="button">Yes</label>

                    <input
                        type="radio"
                        class="button"
                        name="pets[0][related-questions][is-spayed-or-neutered-$boolean]"
                        id="pets[0]-neutered-no"
                        value="false">
                    <label
                        for="pets[0]-neutered-no"
                        class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Has your pet had any behaviour complains?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][has-behaviour-complains-$boolean]"
                        id="pets[0]-behaviour-complains-yes"
                        value="true"
                        required>
                    <label for="pets[0]-behaviour-complains-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][has-behaviour-complains-$boolean]"
                        id="pets[0]-behaviour-complains-no"
                        value="false"
                        required
                        checked>
                    <label for="pets[0]-behaviour-complains-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Does your pet have chip or tag?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][has-chip-or-tag-$boolean]"
                        id="pets[0]-has-chip-yes"
                        value="true"
                        required checked>
                    <label for="pets[0]-has-chip-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][has-chip-or-tag-$boolean]"
                        id="pets[0]-has-chip-no"
                        value="false"
                        required>
                    <label for="pets[0]-has-chip-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet kept at your address?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][is-kept-at-your-address-$boolean]"
                        id="pets[0]-kept-at-yours-yes"
                        value="true"
                        required checked>
                    <label for="pets[0]-kept-at-yours-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][is-kept-at-your-address-$boolean]"
                        id="pets[0]-kept-at-yours-no"
                        value="false"
                        required>
                    <label for="pets[0]-kept-at-yours-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet kept indoor?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][is-indoor-$boolean]"
                        id="pets[0]-indoor-yes"
                        value="true"
                        required checked>
                    <label for="pets[0]-indoor-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][is-indoor-$boolean]"
                        id="pets[0]-indoor-no"
                        value="false"
                        required>
                    <label for="pets[0]-indoor-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet in good health, and not showing any sign of illness, injury or other medical conditions?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][is-your-pet-healthy-$boolean]"
                        id="pets[0]-healthy-yes"
                        value="true"
                        required checked>
                    <label for="pets[0]-healthy-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][is-your-pet-healthy-$boolean]"
                        id="pets[0]-healthy-no"
                        value="false"
                        required>
                    <label for="pets[0]-healthy-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Has there been legal action resulting from an incident involving your pet?</span>
                <div class="field__inputs group group--merged">
                    <input
                        type="radio"
                        name="pets[0][related-questions][has-legal-action-$boolean]"
                        id="pets[0]-legal-yes"
                        value="true"
                        required checked>
                    <label for="pets[0]-legal-yes" class="button">Yes</label>

                    <input
                        type="radio"
                        name="pets[0][related-questions][has-legal-action-$boolean]"
                        id="pets[0]-legal-no"
                        value="false"
                        required
                        checked>
                    <label for="pets[0]-legal-no" class="button">No</label>
                </div>
            </div>
        </div>
    </div>
</div>
`;

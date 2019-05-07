import { html } from '../../src/lit-html';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default () => html`
<div class="job-input">
    <div name="owner">
        <div name="owner[person]">
            <div class="field">
                <label class="field__name" for="">What is your pet's breed?</label>
                <select name="owner[person][title]">
                    ${ TITLES.map(t => html`
                        <option value="${t}"/> ${t}</option>`
                    )}
                </select>
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][first-name]">First Name</label>
                <input type="text" name="owner[person][first-name]" placeholder="Jane" required />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][middle-name]">Middle Name</label>
                <input type="text" name="owner[person][middle-name]" placeholder="" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][last-name]">Last Name</label>
                <input type="text" name="owner[person][last-name]" placeholder="" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][date-of-birth]">Date Of Birth</label>
                <input type="date" name="owner[person][date-of-birth]" value="1990-04-02" required>
            </div>
        </div>

        <div name="owner[address]">
            <label for="owner[address][line1]" class="field__name">Line 1</label>
            <input type="text" name="owner[address][line1]" id="owner[address][line1]" required/>

            <label for="owner[address][line2]" class="field__name">Line 2</label>
            <input type="text" name="owner[address][line2]" id="owner[address][line2]" required/>

            <label for="owner[address][city]" class="field__name">City</label>
            <input type="text" name="owner[address][city]" id="owner[address][city]" required/>

            <label for="owner[address][country-subdivision]" class="field__name">County</label>
            <input type="text" name="owner[address][country-subdivision]" id="owner[address][country-subdivision]" required/>

            <!-- select -->
            <label for="owner[address][country-code]" class="field__name">Country Code</label>
            <input type="text" name="owner[address][country-code]" id="owner[address][country-code]" required/>

            <label for="owner[address][post-code]" class="field__name">post-code</label>
            <input type="text" name="owner[address][post-code]" id="owner[address][post-code]" required/>
        </div>
    </div>
</div>
`;

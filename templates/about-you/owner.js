import { html } from '../../src/lit-html';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default (maritalStatusOptions) => html`
    <div name="owner">
        <div name="owner[person]" class="filed-set">
            <div class="field">
                <label class="field__name">Title</label>
                <select name="owner[person][title]">
                    ${ TITLES.map(t => html`
                    <option value="${t}" /> ${ t.toUpperCase() }</option>`
                    ) }
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
                <input type="text" name="owner[person][last-name]" placeholder="Doe" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][date-of-birth]">Date Of Birth</label>
                <input type="date" name="owner[person][date-of-birth]" value="1990-04-02" required>
            </div>

            <div class="field">
                <span class="field__name">Marital Status</span>
                <select name="selected-marital-status-option">
                    ${ maritalStatusOptions.map(ms => html`
                    <option value="${ms }"> ${ ms } </option>`
                    ) }
                </select>
            </div>
        </div>

        <div name="account" class="filed-set">
            <div class="field">
                <label class="field__name" for="account[email]">Email</label>
                <input type="email" name="account[email]" placeholder="example@example.com" value="example@example.com" required>
            </div>

            <div class="field">
                <label class="field__name" for="account[phone]">Phone</label>
                <input type="text" name="account[phone][country-code]" value="gb" required>
                <input type="tel" name="account[phone][number]" placeholder="phone number" value="07912341234" required>
            </div>

            <div>
                <input type="hidden" name="account[password]" value="">
                <input type="hidden" name="account[is-existing-$boolean]" value="false">
            </div>
        </div>

        <div name="owner[address]" class="filed-set">
            <div class="field">
                <label for="owner[address][line1]" class="field__name">Line 1</label>
                <input type="text" name="owner[address][line1]" id="owner[address][line1]" value="587" required />
            </div>

            <div class="field">
                <label for="owner[address][line2]" class="field__name">Line 2</label>
                <input type="text" name="owner[address][line2]" id="owner[address][line2]" value="high road" required />
            </div>

            <div class="field">
                <label for="owner[address][city]" class="field__name">City</label>
                <input type="text" name="owner[address][city]" id="owner[address][city]" value="london" required />
            </div>

            <div class="field">
                <label for="owner[address][country-subdivision]" class="field__name">County</label>
                <input type="text" name="owner[address][country-subdivision]" id="owner[address][country-subdivision]" value="" />
            </div>

            <div class="field">
            <!-- select -->
                <label for="owner[address][country-code]" class="field__name">Country Code</label>
                <input type="text" name="owner[address][country-code]" id="owner[address][country-code]" value="gb" required />
            </div>

            <div class="field">
                <label for="owner[address][postcode]" class="field__name">post-code</label>
                <input type="text" name="owner[address][postcode]" id="owner[address][postcode]" value="E11 4PB" required />
            </div>
        </div>
    </div>
`;

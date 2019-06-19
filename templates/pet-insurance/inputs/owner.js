import { html } from '/src/main.js';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];
const MARITAL_STATUS = ['Civil Partner', 'Cohabiting', 'Divorced', 'Married', 'Separated', 'Single', 'Widowed'];

export default () => html`
    <div name="owner">
        <div name="owner[person]" class="field-set">
            <div class="field">
                <label class="field__name">Title</label>
                <select
                    name="owner[person][title]"
                    required>
                    ${ TITLES.map(t => html`<option value="${ t }">${ t.toUpperCase() }</option>`) }
                </select>
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][first-name]">First Name</label>
                <input
                    type="text"
                    name="owner[person][first-name]"
                    pattern="^[A-Za-z]+$"
                    data-error="First name should only contain letters (A-Z and a-z)"
                    required />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][middle-name]">
                    Middle Name
                </label>
                <input
                    type="text"
                    name="owner[person][middle-name]" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][last-name]">Last Name</label>
                <input
                    type="text"
                    name="owner[person][last-name]"
                    pattern="^[A-Za-z]+$"
                    data-error="Last name should only contain letters (A-Z and a-z)"
                    required />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][date-of-birth]">Date Of Birth</label>
                <input
                    type="date"
                    name="owner[person][date-of-birth]"
                    required />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][marital-status]">Marital Status</label>
                <select
                    name="owner[person][marital-status]"
                    required />
                    ${ MARITAL_STATUS.map(ms => html`<option value="${ ms }">${ ms }</option>`) }
                </select>
            </div>
        </div>

        <div name="owner[address]" class="field-set">
            <div class="field">
                <label for="owner[address][property-number]" class="field__name">Number of Property</label>
                <input
                    type="text"
                    name="owner[address][property-number]"
                    id="owner[address][property-number]"
                    required />
            </div>

            <div class="field">
                <label for="owner[address][postcode]" class="field__name">Postcode</label>
                <input
                    type="text"
                    name="owner[address][postcode]"
                    id="owner[address][postcode]"
                    required />
            </div>
        </div>
    </div>
`;

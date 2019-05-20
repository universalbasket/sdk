import { html } from '../../src/lit-html';

const TITLES = ['mr', 'ms', 'mrs', 'miss'];

export default (prefix = 'person') => html`
<div class="section">
    <div class="section__body">
        <div name="${prefix}" class="filed-set">
            <div class="field">
                <label class="field__name">Title</label>
                <select name="${prefix}[title]">
                    ${ TITLES.map(t => html`
                    <option value="${t}"> ${ t.toUpperCase() }</option>`
                    ) }
                </select>
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[first-name]">First Name</label>
                <input type="text" name="${prefix}[first-name]" placeholder="Jane" required />
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[middle-name]">Middle Name</label>
                <input type="text" name="${prefix}[middle-name]" placeholder="" />
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[last-name]">Last Name</label>
                <input type="text" name="${prefix}[last-name]" placeholder="Doe" required />
            </div>
        </div>
    </div>
</div>
`;

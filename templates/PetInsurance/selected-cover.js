import { html } from '/web_modules/lit-html/lit-html.js';

export default (covers) => html`
    <div class="field field-set">
        <span class="field__name">Select Cover</span>
        <div class="field__inputs group group--merged">
        ${ covers.map(cover => html`
            <input
                type="radio"
                name="selected-cover"
                value="${cover}"
                id="selected-cover-${cover}"
                required>
            <label for="selected-cover-${cover}" class="button">${cover}</label>
            `)
        }
        </div>
    </div>
`;

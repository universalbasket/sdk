import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
//import { } from '../inputs/index.js';

export default function marketingConsent(name, { availableDirectoryListingOptions }) {
    const key = 'selected-directory-listing-options';

    return render(html`
        <hr>
        <h2>Directory listing options</h2>
        <p>
            Please select your options:
        </p>
        <div class="form__section">
            <div id="${key}" class="field field--list">
                ${ availableDirectoryListingOptions.map((o, i) => html`
                    <div class="field-item field-item--multi-select">
                        <input
                            type="checkbox"
                            value="${JSON.stringify(o)}"
                            name="${key}-$object[]"
                            id="${key}-${i}" />
                        <div>
                            <label for="${key}-${i}">
                                <b>${o.option}</b>
                            </label>
                            <br />
                            ${o.text}
                        </div>
                    </div>
                `) }
            </div>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Continue</button>
            </div>
        </div>
    `);
}

import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
//import { } from '../inputs/index.js';

export default function marketingConsent({ name, data: { availableMarketingContactOptions } }) {
    const key = 'selected-marketing-contact-options';

    return render(html`
        <hr>
        <h2>Marketing consent</h2>
        <p>
            We'd like to contact you every so often with offers.
            Please check the types of marketing material you wish to receive:
        </p>
        <div class="form__section">
            <div id="${key}" class="field field--list">
                ${ availableMarketingContactOptions.map((o, i) => html`
                    <div class="field-item field-item--multi-select">
                        <input
                            type="checkbox"
                            value="${JSON.stringify(o)}"
                            name="${key}-$object[]"
                            id="${key}-${i}" />
                        <div>
                            <label for="${key}-${i}">
                                <b>${o.name}</b>
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

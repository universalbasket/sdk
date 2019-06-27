import { html } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { availableMarketingContactOptions }) => {
    const key = 'selected-marketing-contact-options';
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop - 110, behaviour: 'smooth' });

    return html`
        <h2>Marketing consent</h2>

        <p>
            We'd like to contact you every so often with offers. Please check the types of marketing material you wish to receive:
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
        </div>`;
};

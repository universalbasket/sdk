import { html, templates } from '/src/main.js';

const key = 'selected-marketing-contact-options';

const onChange = {
    handleEvent(e) {
        const selectedInputs = document.querySelectorAll(`#${key} input[type="checkbox"]:checked`);

        if (selectedInputs.length > 0) {
            document.querySelector('#default-null-value').remove();
        }
    }
};

export default (name, { availableMarketingContactOptions }) => {
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop -110, behaviour: 'smooth' });

    return html`
        <h2>Marketing consent</h2>

        <p>
            We'd like to contact you every so often with offers. Please check the types of marketing material you wish to receive:
        </p>

        <div class="section__hide-disabled">
            <div id="${key}" class="field field--list">
                ${ availableMarketingContactOptions.map((o, i) => html`
                    <div class="field-item field-item--multi-select">
                        <input
                            type="checkbox"
                            value="${JSON.stringify(o)}"
                            @click="${onChange}"
                            name="${key}-$object[]"
                            id="${key}-${i}" />
                        <div>
                            <label for="${key}-${i}" class="field__name">${o.name}</label>
                            <br />
                            ${o.text}
                        </div>
                    </div>
                `) }

                <input
                    type="hidden"
                    value="${JSON.stringify(null)}"
                    id="default-null-value"
                    name="${key}-$object" />
            </div>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Continue</button>
            </div>
        </div>`;
};

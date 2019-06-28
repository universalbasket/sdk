import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { policyWording, productInformation, privacyPolicy, statementOfFact }) => {
    return html`
        <hr>
        <h2>Declarations</h2>
        <div class="form__section">
            <ul>
                <li>${ policyWording.contents.map(templates.markup) }</li>
                <li>${ productInformation.contents.map(templates.markup) }</li>
                <li>${ privacyPolicy.contents.map(templates.markup) }</li>
                <li>${ statementOfFact.contents.map(templates.markup) }</li>
            </ul>

            <div class="field">
                <div class="field-item field-item--multi-select">
                    <input
                        type="checkbox"
                        value=""
                        id="agree-terms"
                        required />
                    <label for="agree-terms">
                        <b>I agree to all of the above terms</b>
                    </label>
                </div>
            </div>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${ name }">Continue</button>
            </div>
        </div>`;
};

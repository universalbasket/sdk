import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { templates } from '/src/main.js';

export default function declarations({ name, data, sdk }) {
    const {
        policyWording,
        productInformation,
        privacyPolicy,
        statementOfFact
    } = data;
    const statementOfFactFile = statementOfFact.contents.find(item => item.type === 'File');

    return render(html`
        <hr>
        <h2>Declarations</h2>
        <div class="form__section">
            <ul>
                <li>${ policyWording.contents.map(templates.markup) }</li>
                <li>${ productInformation.contents.map(templates.markup) }</li>
                <li>${ privacyPolicy.contents.map(templates.markup) }</li>
                <li>
                    <p>I have checked the details in the Statement of Fact are correct.</p>
                    ${ templates.file({ ...statementOfFactFile, name: 'View document' }, sdk) }
                </li>
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
        </div>
    `);
}

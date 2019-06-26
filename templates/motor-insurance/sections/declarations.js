import { html } from '/src/main.js';
//import { } from '../inputs/index.js';

export default name => {
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop - 110, behaviour: 'smooth' });

    return html`
        <h2>Declarations</h2>

        <div class="section__hide-disabled">
            <ul>
                <li>I have checked the details in the <a href="#">statement of fact</a> are correct</li>
                <li>I have reviewed the <a href="#">privacy policy</a></li>
                <li>I have reviewed the <a href="#">product information</a></li>
            </ul>

            <div class="field">
                <div class="field-item field-item--multi-select">
                    <input
                        type="checkbox"
                        value=""
                        id="agree-terms"
                        required />
                    <label class="field-name" for="agree-terms">
                        I agree to all of the above terms
                    </label>
                </div>
            </div>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Continue</button>
            </div>
        </div>`;
};

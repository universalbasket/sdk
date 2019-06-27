import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { statements }) => {
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop - 110, behaviour: 'smooth' });

    return html`
        <hr />
        <h2>Statements</h2>
        <div class="form__section">
            <ol>
                ${ statements.contents.map(statement => html`<li>${ templates.markup(statement) }</li>`) }
            </ol>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${ name }">Continue</button>
            </div>
        </div>`;
};

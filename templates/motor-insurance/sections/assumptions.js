import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { assumptions }) => {
    return html`
        <h2>Assumptions</h2>

        <div class="form__section">
            <ol>
                ${ assumptions.contents.map(assumption => html`<li>${ templates.markup(assumption) }</li>`) }
            </ol>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${ name }">Continue</button>
            </div>
        </div>`;
};

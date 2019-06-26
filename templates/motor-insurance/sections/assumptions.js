import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { assumptions }) => {
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop - 110, behaviour: 'smooth' });

    return html`
        <h2>Assumptions</h2>

        <div class="section__hide-disabled">
            ${ assumptions.contents.map(templates.markup) }

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Continue</button>
            </div>
        </div>`;
};

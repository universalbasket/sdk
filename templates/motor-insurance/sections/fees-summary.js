import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { feesSummary }) => {
    return html`
        <hr>
        <h2>Fees summary</h2>
        <div class="form__section">
            <ol>
                ${ feesSummary.contents.map(statement => html`<li>${ templates.markup(statement) }</li>`) }
            </ol>
            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${ name }">Continue</button>
            </div>
        </div>`;
};

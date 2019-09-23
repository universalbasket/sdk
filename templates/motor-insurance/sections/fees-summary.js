import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import templates from '../helpers/index.js';
//import { } from '../inputs/index.js';

export default function feesSummary({ name, storage }) {
    const feesSummary = storage.get('output', 'feesSummary');

    return render(html`
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
        </div>
    `);
}

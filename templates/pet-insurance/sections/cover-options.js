import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedCoverOptions } from '../inputs/index.js';

export default function coverOptions({ name, storage }) {
    const availableCoverOptions = storage.get('output', 'availableCoverOptions');

    return render(html`
        ${selectedCoverOptions(availableCoverOptions)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

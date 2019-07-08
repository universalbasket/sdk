import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedCoverType as input } from '../inputs/index.js';

export default function selectedCoverType(name, { availableCoverTypes }) {
    return render(html`
        ${input(availableCoverTypes)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Select</button>
        </div>
    `);
}

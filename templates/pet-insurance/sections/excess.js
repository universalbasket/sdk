import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedVoluntaryExcess } from '../inputs/index.js';

export default function excess({ name, data: { availableVoluntaryExcesses } }) {
    return render(html`
        ${selectedVoluntaryExcess(availableVoluntaryExcesses)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
        </div>
    `);
}

import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { LandlineCheck, LandlineOptions } from '../inputs/index.js';

export default function landline({ name, data = {} }) {
    return render(html`
        ${LandlineCheck()}
        ${data.landlineOptions ? hidden(data.landlineOptions) : LandlineOptions() }

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Look-up</button>
        </div>
    `);
}

function hidden(data) {
    return html`<input type="hidden" name="landline-options-$object" value="${JSON.stringify(data)}" />`;
}

import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { Installation } from '../inputs/index.js';

export default function installation(name, { installationOptions }, skip) {
    if (!installationOptions) {
        return skip();
    }

    return render(html`
        ${Installation(installationOptions)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

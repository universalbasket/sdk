import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { owner, account } from '../inputs/index.js';

export default function aboutYou(name, _data) {
    return render(html`
        ${account()}
        ${owner()}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">
                Look up
            </button>
        </div>
    `);
}

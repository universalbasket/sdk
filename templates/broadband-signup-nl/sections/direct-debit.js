import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { DirectDebitPayment } from '../inputs/index.js';

export default function checkout(name) {
    return render(html`
        ${ DirectDebitPayment() }

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Submit</button>
        </div>
    `);
}

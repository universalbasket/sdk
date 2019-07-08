import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedAddress as input } from '../inputs/index.js';

export default function selectedAddress(name, { availableAddresses }, skip) {
    if (availableAddresses == null) {
        return skip();
    }

    return render(html`
        ${input(availableAddresses)}

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">continue</button>
        </div>
    `);
}

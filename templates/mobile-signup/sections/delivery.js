import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

import { Address } from '../inputs/index.js';

export default function aboutYou({ name }) {
    return render(html`
        ${Address('deliveryAddress')}
        
        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

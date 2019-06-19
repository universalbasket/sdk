import { html } from '/web_modules/lit-html/lit-html.js';

export default function(err) {
    if (err) {
        console.error(err);
    }

    const message = typeof err === 'string' ? err : 'Please check the items in red below.';

    return html`
    <div class="flash-error">
        <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
        <p>${ message }</p>
    </div>`;
}


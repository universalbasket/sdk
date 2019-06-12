import { html } from '/web_modules/lit-html/lit-html.js';

export default function(err) {
    console.error(err);
    return html`
    <div class="flash-error">
        <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
        <p>Please check the items in red below.</p>
    </div>`;
}


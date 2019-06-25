import { html, render } from '/web_modules/lit-html/lit-html.js';
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js';

export default function create(error) {
    const el = document.querySelector('#flash-error');

    if (error) {
        console.error(error);
    }

    return {
        show: () => { render(wrap(error), el); },
        hide: () => { render('', el); }
    };
}

function wrap(err) {
    const message = typeof err === 'string' ? err : 'Please check the items in red below.';

    return html`
        <div class="flash-error">
            <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
            <p>${ unsafeHTML(message) }</p>
        </div>`;
}

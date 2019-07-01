import { html, render } from '/web_modules/lit-html/lit-html.js';

export default function create(error) {
    const el = document.querySelector('#flash-error');

    if (error) {
        console.error(error);
    }

    return {
        show: () => { render(template(), el); },
        hide: () => { render('', el); }
    };
}

function template() {
    return html`
        <div class="flash-error">
            <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
            <p>Please check the items in red below.</p>
        </div>`;
}

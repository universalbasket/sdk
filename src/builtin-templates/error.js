import { html, render } from '/web_modules/lit-html/lit-html.js';

const template = html`
    <div class="page">
        <h2>We’re sorry. We can’t continue your purchase at the moment.</h2>
        <p>You can retry or get in touch with us at support@emailaddre.ss</p>
    </div>
`;

export default function(selector = '#app') {
    return {
        init: () => {
            const target = document.querySelector(selector);
            if (!target) {
                throw new Error(`loading: selector ${selector} not found`);
            }

            render(template, target);
        }
    };
}

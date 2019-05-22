import { html, render } from '../node_modules/lit-html/lit-html.js';

export default (selector = '#app') => render(template, document.querySelector(selector));
const template = html`
<div class="loading">
    <h2 id="loading-message">
        We are preparing your form...
    </h2>
</div>
`;

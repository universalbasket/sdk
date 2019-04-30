import { html } from '../node_modules/lit-html/lit-html.js';

export default (msg) => html`
<div class="loading">
    <h2 id="loading-message">
        We are processing your request...
    </h2>
    <pre>${msg}</pre>
</div>
`;

import { html } from '../node_modules/lit-html/lit-html.js';

export default (err) => html`
<div class="fallback">
    <h2 id="fallback-message">
        Oh no, Something went wrong!
    </h2>
    <pre>${err}</pre>
</div>
`;

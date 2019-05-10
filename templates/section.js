import { html } from '../src/lit-html';

export default (title) => html`
    <div class="section">
        <h3 class="section__header">${title}</h3>
        <pre id="error"></pre>
        <form class="section__body" id="target"></form>

        <button type="button" class="button button--right button--primary" id="submitBtn">Continue</button>
    </div>
`;

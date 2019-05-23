import { html } from '../src/lit-html';

export default () => html`
    <div class="section">
        <pre id="error"></pre>
        <form class="section__body" id="target"></form>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submitBtn">Continue</button>
        </div>
    </div>
`;

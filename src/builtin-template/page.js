import { html } from '../lit-html';

export default () => html`
    <div class="page">
        <pre id="error"></pre>
        <div class="page__body" id="target"></div>

        <div class="page__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn">Continue</button>
        </div>
    </div>
`;

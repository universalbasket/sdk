import { html } from '../lit-html';

export default () => html`
    <div class="page">
        <pre id="error"></pre>
        <div class="page__body" id="target"></div>

        <div class="page__actions">
        </div>
    </div>
`;

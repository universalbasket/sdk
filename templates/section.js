import { html } from '../src/lit-html';

export default () => html`
    <div class="section">
        <pre id="error"></pre>
        <div class="section__body" id="target"></div>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submitBtn">Select</button>
        </div>
    </div>
`;

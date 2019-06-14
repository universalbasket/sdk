import { html } from '/src/main.js';
import { payment } from '../inputs/index.js';

export default (name, data) => html`
    ${payment(data.otp)}

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Pay</button>
    </div>
`;

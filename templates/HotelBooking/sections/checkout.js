import { html, render } from 'lit-html';
import { payment } from '../inputs/index';

export default (name, data) => html`
    ${payment(data.otp)}

    <div class="section__actions">
        <button
            type="button"
            class="button button--right button--primary"
            id="submit-btn-${name}">Pay</button>
    </div>
`;

import { html } from '/web_modules/lit-html/lit-html.js';
import { finalPriceConsent } from '../inputs/index.js';

export default (name, { finalPrice }) => html`${finalPriceConsent(finalPrice)}
        <div class="section__actions">
        <button type="button" class="button button--right" id="cancel-btn">Cancel</button>
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Confirm and pay</button>
    </div>`
;

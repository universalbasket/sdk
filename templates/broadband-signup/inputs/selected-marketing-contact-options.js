import { html } from '/web_modules/lit-html/lit-html.js';

export default function selectedMarketingContactOptions() {
    return html`
        <input type="hidden" name="selected-marketing-contact-options-$object" value="${JSON.stringify(null)}" />
    `;
}

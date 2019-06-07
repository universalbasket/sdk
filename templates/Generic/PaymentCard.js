import { html } from '/web_modules/lit-html/lit-html.js';

const baseUrl = 'https://vault.automationcloud.net/forms/index.html';
const fields = 'pan,name,expiry-select,cvv_cvv';
const brands = 'visa,mastercard';
const validateOnInput = 'on';
const css = 'https://kk-iframe-prd.glitch.me/style.css'; // todo: host it somewhere proper.

export default otp => {
    const src = `${baseUrl}?otp=${otp}&css=${css}&fields=${fields}&brands=${brands}&validateOnInput=${validateOnInput}`;

    return html`
        <iframe
            id="vault-iframe"
            width="400"
            height="280"
            scrolling="no"
            src="${src}">
        </iframe>`;
};

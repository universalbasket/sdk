import { html } from '/web_modules/lit-html/lit-html.js';

const BASE_URL = 'https://vault.automationcloud.net/forms/index.html';
const DEFAULT_OPTIONS = {
    fields: 'pan,name,expiry-select,cvv',
    brands: 'visa,mastercard,amex',
    validateOnInput: 'on',
    css: 'https://ubio-application-bundle-dummy-server.glitch.me/style.css'
};

export default (otp, options = {}, style = {}) => {
    const formOptions = {
        ...DEFAULT_OPTIONS,
        ...options
    };

    const optionsString = Object.keys(formOptions)
        .filter(key => formOptions[key])
        .map(key => `&${key}=${formOptions[key]}`)
        .join('');

    const src = `${BASE_URL}?otp=${otp}${optionsString}`;

    return html`
        <iframe
            id="ubio-vault-form"
            width="${style.width ? style.width : 400}"
            height="${style.height ? style.height : 280}"
            scrolling="${style.scrolling ? style.scrolling : 'no'}"
            src="${src}">
        </iframe>`;
};

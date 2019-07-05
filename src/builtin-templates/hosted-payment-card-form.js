import { html } from '/web_modules/lit-html/lit-html.js';

const BASE_URL = 'https://vault.automationcloud.net/forms/index.html';
const DEFAULT_OPTIONS = {
    fields: 'pan,name,expiry-select,cvv',
    brands: 'visa,mastercard,amex',
    validateOnInput: 'on',
    css: 'https://ubio-application-bundle-dummy-server.glitch.me/style.css'
};

export default (otp, formOptions = {}, formStyles = {}) => {
    const options = {
        ...DEFAULT_OPTIONS,
        ...formOptions
    };

    const optionsString = Object.keys(options)
        .filter(key => options[key])
        .map(key => `&${key}=${options[key]}`)
        .join('');

    const src = `${BASE_URL}?otp=${otp}${optionsString}`;

    return html`
        <iframe
            id="ubio-vault-form"
            width="${formStyles.width ? formStyles.width : '100%' }"
            height="${formStyles.height ? formStyles.height : 380}"
            scrolling="${formStyles.scrolling ? formStyles.scrolling : 'no'}"
            src="${src}">
        </iframe>`;
};

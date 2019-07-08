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

    const iframe = document.createElement('iframe');
    iframe.src = `${BASE_URL}?otp=${otp}${optionsString}`;

    iframe.id = 'ubio-vault-form';
    iframe.width = formStyles.width ? formStyles.width : '100%';
    iframe.height = formStyles.height ? formStyles.height : 380;
    iframe.scrolling = formStyles.scrolling ? formStyles.scrolling : 'no';

    return iframe;
};

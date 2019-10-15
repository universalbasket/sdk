const BASE_URL = 'https://vault.automationcloud.net/forms/index.html';
const DEFAULT_OPTIONS = {
    fields: ['pan', 'name', 'expiry-select', 'cvv'],
    brands: ['visa', 'mastercard', 'amex']
};

function formatFields(fields) {
    const formatted = [];

    for (const element of fields) {
        formatted.push(typeof element === 'string' ? element : `${element.field}_${element.name}`);
    }

    return formatted.join(',');
}

function formatBrands(brands) {
    return brands.join(',');
}

export default function hostedPaymentCardForm(otp, formOptions = {}, formStyles = {}) {
    if (!formOptions.css) {
        throw new Error('css is a required field option.');
    }

    const search = new URLSearchParams([
        ['otp', otp],
        ['fields', formatFields(formOptions.fields || DEFAULT_OPTIONS.fields)],
        ['brands', formatBrands(formOptions.brands || DEFAULT_OPTIONS.brands)],
        ['validateOnInput', formOptions.validateOnInput === false ? 'off' : 'on'],
        ['css', formOptions.css]
    ]).toString();

    const iframe = document.createElement('iframe');
    iframe.src = `${BASE_URL}?${search}`;
    iframe.className = 'vault-form';
    iframe.width = formStyles.width || '100%';
    iframe.height = formStyles.height || '380';
    iframe.scrolling = formStyles.scrolling || 'no';

    return iframe;
}

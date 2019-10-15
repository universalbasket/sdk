import templates from '../helpers/index.js';

// https://protocol.automationcloud.net/Generic#PaymentCard
export default function hostedForm(otp) {
    // Styling and configuring the form. See the README.
    const formConfiguration = {
        css: 'https://ubio-application-bundle-test-server.glitch.me/style.css',
        fields: ['pan', 'name', 'expiry-select', 'cvv'],
        brands: ['visa', 'mastercard', 'amex'],
        validateOnInput: true
    };

    const iframeStyles = {
        width: '100%',
        height: '380',
        scrolling: 'no'
    };

    return templates.hostedPaymentCardForm(otp, formConfiguration, iframeStyles);
}

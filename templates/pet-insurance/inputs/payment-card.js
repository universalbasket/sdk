import { templates } from '/src/main.js';

function hostedForm(otp) {
    // Styling and configuring the form
    // https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form
    const formConfiguration = {
        // css (optional). An absolute URL
        //
        // https://docs.automationcloud.net/docs/vaulting-payment-card#section-css-optional-
        css: 'https://ubio-application-bundle-dummy-server.glitch.me/style.css',

        // fields (optional)
        // https://docs.automationcloud.net/docs/vaulting-payment-card#section-fields-optional-
        // https://docs.automationcloud.net/docs/vaulting-payment-card#section-interacting-with-the-form
        //
        // The form has 4 fields: name, pan (card number), expiry date, cvv.
        // - change the order of fields
        // - change the labels for fields
        // - specify expiry date fields to be input (expiry) or select (expiry-select)
        fields: 'pan,name,expiry-select,cvv',

        // brands (optional).
        //
        // restricts aaceptable card brands list
        brands: 'visa,mastercard,amex',

        // validateOnInput (optional).
        //
        // 'on' to ebables form validation on input: whenever each field is updated, you receive the validation result message and an .invalid class gets added or removed accordingly
        // 'off' disables form validation on user input, form will still be validated on submit
        // Any other values will be ignored and the value will be set to 'off'.
        validateOnInput: 'on'
    };

    const iframeStyles = {
        width: '100%',
        height: 380,
        scrolling: 'no'
    };

    return templates.hostedPaymentCardForm(otp, formConfiguration, iframeStyles);
}

//https://protocol.automationcloud.net/Generic#PaymentCard
export default otp => hostedForm(otp);

# SDK application bundle
Application bundle using @ubio/sdk.

## building form

### Form name conventions for building input data
To create input, you need to build a right structure from the form that our [protocol](https://protocol.automationcloud.net/) expects to get. For instance, you'd like to create the `PetInsurance.policyOptions` input, you will need to send JSON data like:
```
{
    "policyOptions": {
        "coverStartDate": "2019-06-01",
        "numberOfPetsOwned": 1,
        "jointPolicyHolder": false
    }
}
```

To build that structure, you need to specify the right name for the input field in your form. Nest the object with brackets(`[]`), if you need to build an array, use numbers in the brackets such as `pets[0][name]`.
```html
<div name="policy-options">
    <input
        type="date"
        name="policy-options[cover-start-date]" value="2019-06-01">

    <input
        type="number"
        name="policy-options[number-of-pets-owned-$number]"
        value="1"/>

    <input
        type="radio"
        name="policy-options[joint-policy-holder-$boolean]"
        value="true">

    <input
        type="radio"
        name="policy-options[joint-policy-holder-$boolean]"
        value="false"
        checked>
</div>
```
If you need to convert the value to integer or boolean, suffix the name with `-$number`, `-$boolean` or `-$object` to let the form serializer know it needs to parse the value. (if it fails to convert to the specified type, it will use string value)

Then when you submitting a form, it will camel-case the keys and serialize the form to JSON object which is ready to be posted to automation cloud.

### Using the hosted payment card form

All payment cards must be vaulted and tokenised before you can use them with the Automation Cloud services. For more details, please read our [docs](https://docs.automationcloud.net/docs/vaulting-payment-card).

We've integrated our [hosted payment form](https://docs.automationcloud.net/docs/vaulting-payment-card#section-using-the-hosted-payment-card-form) as a template for your convenience. Consider the following example:

```
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
```

You must provide valid OTP as a parameter when you embed the form.
Consider the following example. Here, `waitFor: ['_.otp']` insures that the `checkout` template receives the `otp`.
```
    pages: [
        ...,
        {
            name: 'payment',
            route: '/payment',
            title: 'Payment Details',
            sections: [
                {
                    name: 'checkout',
                    template: checkout,
                    waitFor: ['_.otp']
                }
            ]
        }
        ...
    ]
```

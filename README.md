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

Plase see [docs](https://docs.automationcloud.net/docs/vaulting-payment-card#section-using-the-hosted-payment-card-form) for more information.

The embedded card form's URL is https://vault.automationcloud.net/forms/index.html.
You must provide valid OTP as a parameter when you embed the form. Consider the following example:
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

You need to style and configure your payment form separately, by providing the options via query parameters.
The `css` parameter takes the absolute URL to your CSS file, you need to host it separately.
See [doc](https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form) for more details.



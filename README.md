# SDK application bundle
Application bundle using @ubio/sdk.

## building form
We use [lit-html](https://lit-html.polymer-project.org/guide) to support template for all browsers, including IE9.

### Form name conventions for building input data
To create input, you need to build a right structure from the form that our [protocol](https://protocol.automationcloud.net/) expects to get. For instance, you'd like to create the `PetInsurance.policyOptions` input, you will need to send json data like:
```
{
    "policyOptions": {
        "coverStartDate": "2019-06-01",
        "numberOfPetsOwned": 1,
        "jointPolicyHolder": false
    }
}
```

To build that structure, you just need to specify the right name for the input field in your form. Nest the object with brackets(`[]`), if you need to build an array, use numbers in the brackets such as `pets[0][name]`.
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
Also, if you need to convert the value to integer or boolean, suffix the name with `-$number`, `-$boolean` or `-$object` to let the form serializer know it needs to parse the value. (if it fails to convert to the specified type, it will just use string value)

Also, if you need to convert the value to integer, boolean or object, suffix the name with `-$number`, `-$boolean` or `-$object`to let the form serializer know.(if it fails to convert to the specified type, it will just use string value and it could cause 400 response from automation cloud as the validation won't pass) Then when you submitting form, it will camel case the keys to make them as same as protocol then serialize the form to json object which is ready to be posted to automation cloud.




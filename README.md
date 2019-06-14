# SDK application bundle

Application bundle that provides sample applications for various domains which enables end user to create the job using automation cloud

## Overview
We use [lit-html](https://lit-html.polymer-project.org/guide) library to render the forms and templates. It supports old browsers, such as IE9 as well as modern browsers.

## Prerequisites

You need npm installed

## Installing

```sh
#to be written when cli work is done
```

## Getting Started

### /src/main.js'

```
list available feature and functions
```

### ubio.config.js

#### `cache`: Array[{ key: String, sourceInputKeys: Array[string]}]
You can specify the rules for using [cache output](https://docs.automationcloud.net/docs/query-previous-outputs) to use it for your application. `key` property is the _output key_ that you want to retrieve. `sourceInputKeys` is array of input keys that will be used for applying [input criteria](https://docs.automationcloud.net/docs/query-previous-outputs#section-2-querying-previous-output-data-based-on-input-criteria) on your request. As soon as you submit the all of the input keys, it will fetch the cache data and save it locally. If you don't wish to apply any input criteria, leave it as an empty array.

#### `pages`: Array[{ name: String, route, title, sections[], excludeStep(optional) }]

example:
```

pages: [
    {
            name: 'confirmation',
            route: '/confirmation',
            title: '',
            sections: [
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.bookingConfirmation']
                }
            ],
            excludeStep: true
    },
    ...]
```

#### `layout`

#### `data`

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

Then when you submitting form, it will camel-case the keys and serialize the form to json object which is ready to be posted to automation cloud.

## Built With

* [lit-html](https://lit-html.polymer-project.org/) - html templating library for JavaScript

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/universalbasket/sdk-application-bundle/tags).

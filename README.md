# SDK application bundle

Application bundle that provides sample applications for various domains which enables end user to create the job using automation cloud

## Overview
We use [lit-html](https://lit-html.polymer-project.org/guide) library to render the forms and templates.

## Prerequisites

You need npm installed

## Installing

```sh
#to be written when cli work is done
```

## Getting Started

### Methods
#### `createApp(ubioConfig, callback)`
Initiating app with config

params:
- ubioConfig: configs from [ubio.config.js](#ubioconfigjs)
- callback: when user gets to the last page

returns:
- function: `init` which start the app.

#### templates
Useful built in templates that you can use.
- modal: modal components
```
import { templates } from '/src/main.js';

// default options:
const options = {
    closeOnOverlay: true, // close modal on overlay click
    showClose: true // show close button
};
const modal = templates.modal(template, 'title', options);

//show modal
modal.show();

//close modal
modal.close();
```

- priceDisplay: parse [Price](https://protocol.automationcloud.net/Generic#Price) object and display nicely
- priceType

#### createInputs(inputs)
params:
- inputs: inputs object i.e. { inputKey: value,... }

returns:
- Promise resolves created inputs.

#### cancelJob()
params: n/a
returns: n/a



## ubio.config.js
This configuration file determines the flows of the application, rules for using cached data and some providing some useful data that you'd like to use.

### `layout`
you must supply layout templates using them. you won't need to change anything from default configuration.

### `pages`: Array[{ name: String, route: String, title: String, sections: Array, excludeStep: Boolean(optional) }]
pages is about setting what pages you want to show in which order and what sections will be in that page. it is a array of object which has a properties of `name`, `route`, `title`, `sections` and `excludeStep`

- name: Name of the page
- route: Route that will be used by the router
- title: page title which will be displayed in progress bar
- sections: Sections that you want to include in the page. See more about [Section](#section)
- excludeStep: if it's true, we do not include it as a step in progress bar. it is useful when you want to exclude the confirmation page from progress

```
pages: [
    {
            name: 'confirmation',
            route: '/confirmation',
            title: 'confirmation',
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


### `cache`: Array[{ key: String, sourceInputKeys: Array[string]}]

### `data`: Object
- `serverUrlPath`: This app is fully frontend and it uses end-user sdk which means you will need your server to initiate the job and create the EndUser auth. more information in [here](https://github.com/universalbasket/javascript-sdk#the-client-flow). So you need to specify the server url so that app can kick off the job. example server code look like [this](https://glitch.com/~ubio-application-bundle-dummy-server) (go to server.js and see one of the endpoint that creating a job)
- `initialInputs`: initial inputs that you'd like to include when creating a job
- `supportEmail(optional)` : support email displayed in the error page.
- `local` : One of the type of [Data](#data) in the app. you can supply predefined input/output using this field. it can be useful when showing estimated finalPrice on summary panel until the live data is available.

## Form name conventions for building input data
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


## Glossaries

### Section

### Data

## Built With

* [lit-html](https://lit-html.polymer-project.org/) - html templating library for JavaScript

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/universalbasket/sdk-application-bundle/tags).

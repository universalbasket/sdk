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
1. Once the project is generated, open `ubio.config.js` then replace the `serverPathUrl` with your own server endpoint to [create the job](#data-object). You can try it with our dummy server, but you won't be able to track how's the job processing in your dashboard as it is not counted as your job. You will need the secret key, permission to access the service(talk to our team if you get authorization error), serviceId to create the job. more information is in [here](https://docs.automationcloud.net/docs/job-create#section-start-your-job)
2. Customize `/layout/headers.js` and `/layout/footer.js` for your own branding.
3. The default `ubio.config.js` contains optimized flows for the Domain and it's been tested with one of our service, but the optimized flow could be differ per service as each website have different flow. So try it with the default setting, then if you need to adjust order of the input forms, you could adjust the `pages` setting and templates in `/sections`.
4. Remember that templates under `/sections` directory must contain button name `#submit-btn-${sectionName}`. Otherwise no event lister submitting inputs will be added. Templates under `/input` directory contains sub set of form that can be used by setions. It is not necessary to make each input template separately but it can be used when you wish to divide forms into chunks rather than putting all into one section template.

> See index.html for usage. 


## Methods(src/main.js)
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
- `category(optional)`: determine the category of the job. default is `test`. We include this information when requesting the job creation to your server so you can either set it up in here or from your server.
- `supportEmail(optional)` : support email displayed in the error page.
- `local` : One of the type of [Data](#data) in the app. you can supply predefined input/output using this field. it can be useful when showing estimated finalPrice on summary panel until the live data is available.

## Name conventions for inputs in templates
As you can see we have a name convention for the job inputs in our template. It is important to understand so that you don't get input validationError from automation cloud.
To supply the input, you need to build a right structure of the json data that fits our [protocol](https://protocol.automationcloud.net/) definitions. For instance, you'd like to create the `PetInsurance.policyOptions` input, you will need to send json data like:
```
{
    "policyOptions": {
        "coverStartDate": "2019-06-01",
        "numberOfPetsOwned": 1,
        "jointPolicyHolder": false
    }
}
```

We serialize the form from the given name for each inputs. let's build the name for above input.
We use kebab-case for the elements so the input key `policyOptions` will be `policy-options`. This will be prefix for the input fields. Now we can create input elements for `policyOptions.coverStartDate`. Nest the object with brackets(`[]`), so it will be `policy-options[cover-start-date]`. If you need to build an array, use numbers in the brackets such as `pets[0][name]`. sometimes you need to parse some value from string to other type such as integer, boolean or object. in this case suffix the last nested key with `-$number`, `-$boolean` or `-$object` to let the form serializer know.
> if it fails to convert to the specified type, it will just use string value but not throw an error. You will get 400 error from automation cloud so it is important for you to validate beforehand.

Here's the final form with right name for the `PetInsurance.policyOptions`.

```html
<div name="policy-options">
    <input
        type="date"
        name="policy-options[cover-start-date]" value="2019-06-01"
        required />

    <input
        type="number"
        name="policy-options[number-of-pets-owned-$number]"
        value="1"
        required />

    <input
        type="radio"
        name="policy-options[joint-policy-holder-$boolean]"
        value="true"
        required />

    <input
        type="radio"
        name="policy-options[joint-policy-holder-$boolean]"
        value="false"
        checked />
</div>
```

## Glossaries

### Section
Section is a template contains one or more of inputs form that you wish to submit together. Sections templates will always consist of forms and submit button. 
Also section template gets 3 arguments, `name`, `data` and `skip` and returns html templates using lit-html. This template is rendered only when the specified data is available and meanwhile, inline-loading will be shown.
- name: section name. Usually use it for submit button.
- data:Object the data object you specified in ubio.config.js as _waitFor_
- skip function that skip the section without submitting and render next section on page.

### Data 


## Built With

* [lit-html](https://lit-html.polymer-project.org/) - html templating library for JavaScript

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/universalbasket/sdk-application-bundle/tags).

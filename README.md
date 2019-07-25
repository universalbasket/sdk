# SDK application bundle

Application bundle using @ubio/client-library.

This repository contains an example application which uses the ubio API with the
JavaScript SDK. It is split into two broad parts:
 - The code in the `/src` directory consumes configuration and functions which
   produce DOM Nodes to render a sequence of _sections_ containing forms.
 - The /templates directory contains functions which render _sections_ from
   templates, which are sometimes nested. These templates use lit-html as an
   example rendering engine.

## Creating a new project

This project also contains a CLI which can be used to generate a fresh project.
With Node.js installed, you can run the following in a terminal:

```shell
npx @ubio/sdk --domain hotel-booking --name my-integration
```

where `hotel-booking` should be replaced with the domain of your choice, and
the name is up to you and a fresh directory will be created and named using it.
The templates of the appropriate domain will be copied into your new project.
This means that they will use `lit-html` by default, but you may use whichever
technology to create Nodes that you like. More explicity, your section templates
should return a Node, which may be such things as `HTMLElement`, `Text`, and
`DocumentFragment` instances.

## The templates directory

The templates directory contains sets of templates for a variety of domains. The
generator CLI uses these to create new projects, but they also serve as examples
on which to base your own templates.

There are also *.config.js modules, which are configuration of layouts, pages,
and caches. The fields of these configuration objects are a subset of the fields
required by the `createApp` function.

## The bundle API

### `createApp({ mountPoint, sdk, layout, pages, input, error, cache, local })`

Where:

| fieldname | description |
| --------- | ----------- |
| `mountpoint` | A reference to a DOM element to append the app layout to. |
| `sdk` | An end-user sdk, initialised with the job ID, service ID, and end-user token. |
| `input` | An object of key value pairs representing input that the job was created with. |
| `layout` | An object with values as layout templates for the header, the footer, and the summary. |
| `error` | A template to render errors. |
| `notFound` | A template to render whenever a page does not exist. |
| `pages` | A list of configurations for pages to be rendered. |
| `cache` | A list of specifications for outputs of previous jobs to cache. |
| `local` | Supplimentary data. |

The `createApp` method is the principal interface of the bundle. By passing it
various templates, an SDK object, and a flow, this function appends elements to
the DOM as a child of `mountpoint`. As data becomes available, pages are
rendered in sequence to acquire more input to progress the job onward to
completion.

This function requires both an `sdk` object and an `inputs` object, which means
that the job must already exist before this function is called. It is up to your
server to perform job creation with initial inputs, and send data to the user
browser to create the `sdk` object, and subsequently call `createApp`.

#### `sdk`

For documentation regarding the `sdk` object, see [the documentation][sdk]. This
library requires the _end-user_ form of the `sdk`.

#### `input`

This is exactly the same inputs object which the job is created with.

#### `layout`

Layout consists of a `headers` template, a `footers` template, and a `summary`
template. The summary template is likely to be the most complex. Each set of
domain templates included with this module has a layout templates, and it is
recommended to base your own off of these.

#### `pages`

Pages represent the steps of your automation. Each is composed of the fields:

 - `name`: Then name of the page.
 - `route`: The route of the page (appears after a `#` in the URL).
 - `title`: The title of the page, rendered in the layout.
 - `sections`: An array of section specfications.

Sections are composed of the fields:

 - `name`: The name of the section.
 - `template`: A function which returns a DOM element or a `DocumentFragment` instance.
 - `waitFor`: List of data (inputs, outputs, etc.) required in order to render the section.

A template here is a function with parameters in the order: `name`, `options`, `skip`, `sdk`.

 - `name`: The name of the template.
 - `options`: Various data fields used to render the template.
 - `skip`: A skip function. renderer will render next section without waiting for end-user's input submission.
 - `sdk`: The sdk instance.

As mentioned, the template must return an element or a document fragment. This
means that if async work needs to happen, then a placeholder element or fragment
must be returned, and parts of it replaced upon resolution of the async work.
This is uncommon, but happens when the sdk must be used.

Existing templates in this repository serve as examples. Since the returned
value is always the reference to a DOM element or a document fragment, you may
use any frontend framework you wish so long as the result is rendered. We've
used lit-html to demonstrate this principle.

#### `cache`

This is an array of objects containing `key` and `sourceInputKeys` fields. When
the inputs of the names in `sourceInputKeys` are known, the app will make a
requests for the output of previous jobs given by `key`. This can be used to
anticipate output _before_ it exists for a job, and can be used to improve the
user experience.

#### `local`

Local is a set of optional fallback data. When nothing is found in active data
or the cache, local is checked last.

#### `error`

:warning: This will be changed to bring it in line with other templates. :warning:

This is a special template for rendering flash errors. It must be a function
which takes a single `selector` parameter for it to target an element to append
elements to, and an optional `sdk` parameter.

It should return an object with an `init` method. This method should build and
append DOM to the element targeted by the selector.

#### `notFound`

:warning: This will be changed to bring it in line with other templates. :warning:

This is a special templates for rendering pages which aren't registered. It must
be a function which takes a single `selector` parameter for it to target an
element to append elements to.

It should return an object with a `renderer` field. This field should be an
object with an `init` method. This method should build and append DOM to the
element targeted by the selector.

## Building forms

### Form name conventions for building input data

To create inputs, you need to structure the form in a way that mirrors our
[protocol][protocol]. For example, if you want to create a
`PetInsurance.policyOptions` input, you will need to send JSON data like:
```
{
    "policyOptions": {
        "coverStartDate": "2019-06-01",
        "numberOfPetsOwned": 1,
        "jointPolicyHolder": false
    }
}
```

To build that structure, you need to specify the correct name for the input
field in your form, addressing objects with brackets(`[]`), if you need to build
an array, use numbers in the brackets such as `pets[0][name]`.

```html
<div name="policy-options">
    <input
        type="date"
        name="policy-options[cover-start-date]" value="2019-06-01">

    <input
        type="number"
        name="policy-options[number-of-pets-owned-$number]"
        value="1">

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
If you need to convert the value to integer or boolean, suffix the name with
`-$number`, `-$boolean` or `-$object` to let the form serializer know that it
needs to parse the value. If parsing to a type fails, the string value will be
used by default.

When the form is submitted, input names will be camel-cased to produce the
expected object fields in the JSON which is posted to our API.

### Using the hosted payment card form

All payment cards must be vaulted and tokenised before you can use them with the
Automation Cloud services. For more information, see
[the payment card documentation][vaulting-payment-card].

We've integrated our [hosted payment form][hosted-payment-form] as a template
for your convenience. This template provides a nicer API than indicated in the
documentation.

```javascript
import { templates } from '/src/main.js';

// See: https://docs.automationcloud.net/docs/vaulting-payment-card
function hostedForm(otp) {
    // Styling and configuring the form
    const x = {
        // css (required) An absolute URL
        css: 'https://ubio-application-bundle-test-server.glitch.me/style.css',

        // fields (optional, defaults shown)
        // https://docs.automationcloud.net/docs/vaulting-payment-card#section-fields-optional-
        // https://docs.automationcloud.net/docs/vaulting-payment-card#section-interacting-with-the-form
        //
        // The form has 4 fields: name, pan (card number), expiry date, cvv.
        // - change the order of fields
        // - change the labels for fields
        // - specify expiry date fields to be input (expiry) or select
        //   (expiry-select)
        fields: ['pan', 'name', 'expiry-select' , 'cvv'],
        // Use objects to rename fields, for example:
        // fields: [{ field: 'pan', label: 'the pan' }, 'name', 'expiry-select', 'cvv']

        // brands (optional, defaults shown).
        //
        // restricts aaceptable card brands list
        brands: ['visa', 'mastercard', 'amex'],

        // validateOnInput (default: true).
        //
        // Whenever each field is updated, you receive the validation result
        // message and an "invalid" class gets added or removed accordingly. Set
        // to false to disable this behaviour. The form will be validated on
        // submission regardless of this setting.
        validateOnInput: true
    };

    const iframeStyles = {
        width: '100%',
        height: '380',
        scrolling: 'no'
    };

    return templates.hostedPaymentCardForm(otp, formConfiguration, iframeStyles);
}
```

You must provide valid OTP (one-time password) as a parameter when you embed the
form. In the following example, `waitFor: ['_.otp']` insures that the `checkout`
template receives the `otp`.
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

You must style and configure your payment form separately by providing the
options via query parameters. The `css` parameter takes the absolute URL to a
CSS file which you must host. See
[the styling and configuration documentation][styling-configuring-payment-form]
for more information.

[sdk]: https://npmjs.com/package/@ubio/sdk
[protocol]: https://protocol.automationcloud.net/
[vaulting-payment-card]: https://docs.automationcloud.net/docs/vaulting-payment-card
[hosted-payment-form]: https://docs.automationcloud.net/docs/vaulting-payment-card#section-using-the-hosted-payment-card-form
[styling-configuring-payment-form]: https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form

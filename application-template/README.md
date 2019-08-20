# ubio sdk application

This project was generated with `npx @ubio/sdk`. All instructions here assume
a recent local installation of Node.js, and that your current working directory
is in a clone of this repository.

## getting started

If you have just run `npx @ubio/sdk`, then this step has been run for you and
you may skip it. If you've cloned this project from a VCS service such as
GitHub, you will need to follow this step.

To begin, dependencies must be installed. To do this run:

```shell
npm install
```

All the tools necessary to work with this project locally will be installed into
the `node_modules` directory, which is ignored by git.

After modules are installed, some files will automatically be copied from
`node_modules` to a directory called `web_modules`.

## development server

To use the development server, you first need to create a file in the project
root called `.env` and add your client token to it. See `.env.example`.

To start the development server, run:

```shell
npm start
```

The server hosts a small form. When you hit the start button a POST request to
the dev server is made instructing it to create a job. The response body of this
POST is used to initialize the SDK in the browser, which then takes over. You
may wish to add fields to this later to provide additional data needed at job
creation time.

**Note**: A new job is created every time you hit the start button. You may need
to update the code here to rehydrate a job found in local storage, or cancel it.

The purpose of having this small form is to highlight that there are things you
must implement (including job creation) before handing control over to the SDK.
The data you post to your server is dependent on your integration (your user
may send some initial inputs, for example).

In general, inputs your server sends to us at job creation time should be
returned to the browser so that the SDK can be initialized with them.

This server hosts pre-bundled JavaScript files. The benefit to this approach
is that you don't need to run the bundler after every change to a JS file. Just
refresh your browser.

The server itself is written in Node.js, and can be found in
[`serve.js`](./serve.js). If you change this file, you will need to quit the
development server and start it again to see the change.

## bundling

With [`src/index.js`](src/index.js) as the entrypoint, the bundler can
collect all the templates and dependencies together into a single JavaScript
file as `dist/bundle.js`. This bundle is gitignored to avoid an out-of-sync
bundle being committed. The bundle comes out as a UMD. You may use it in a
script tag of a page (which appends it to the window), or in a CommonJS or AMD
context as a module. The build may be adjusted if you prefer to use an ES
module. As a plain-old-script, the window will gain a `ubio-bundle` field, an
object with  the same methods seen in [`src/index.js`](src/index.js) as its
fields.

To run the bundler, from the commandline execute:

```shell
npm run build
```

JS files in `web_modules` will become part of the bundle.

CSS will be bundled into `dist/bundle.css`.

The configuration used by the bundler (a utility called
[rollup](https://rollupjs.org/) can be found in
[`rollup.config.js`](rollup.config.js)).

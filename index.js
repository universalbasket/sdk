'use strict';

import kebabCase from 'lodash.kebabcase';
import { render } from './node_modules/lit-html/lit-html.js';
import FlowManager from './src/flow-manager';
import serializeForm from './src/serialize-form';
import api from './src/core';

/* templates */
import templates from './templates/index';

/* flow of the forms, key = input key (for now) */
const FLOW = [
    { key: 'pets', type: 'default' },
    { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes' },/* in-flow, availableBreedTypes */
    { key: 'owner', type: 'default' },
    { key: 'account', type: 'default' },
    { key: 'selectedMaritalStatusOption', inputMethod: "SelectOne",  sourceOutputKey: 'availableMaritalStatusOptions' },/* in-flow, availableMaritalStatusOptions */
    { key: 'selectedAddress', inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses' }, /* in-flow, availableAddresses */
    { key: 'finalPriceConsent', inputMethod: "Consent", sourceOutputKey: "finalPrice" } /* consent */
    //...
];

const flowManager = new FlowManager(FLOW);
const app = document.querySelector('#app');

init();
/* document.querySelector('#init').addEventListener('click', () => {
    init();
}); */

function init() {
    api.createJob({}).then(() => {});

    flowManager.init();
    renderNext();
}

function next() {
    flowManager.next();
    renderNext();
}

function renderNext() {
    const key = flowManager.getCurrentKey();
    const meta = flowManager.getMeta(key);

    if (!meta) {
        console.error('please check your metadata');
        return;
    }

    /* waiting for output, if not - query to previous output */
    const template = templates[key];
    if (!template) {
        return render(templates.fallback(`template for ${key} not found`), app);
    }

    if ((meta.inputMethod === 'SelectOne' || meta.inputMethod === 'Consent' ) && meta.sourceOutputKey != null) {
        //check job state and see if it's awaitingInput && key = selectedBreedType
        console.log(`waiting for job output ${meta.sourceOutputKey}`);

        render(templates.loading(), app);
        //TODO: we should show something while waiting.
        api.waitForJobOutput(meta.sourceOutputKey, (err, output) => {
            if (err) {
                render(templates.fallback(err), app);
                return;
            }

            render(template(output.data), app);
            addSubmitter(key);
        });
    } else {
        render(template(), app);
        addSubmitter(key);
    }
}

function addSubmitter(key) {
    /* this bits need to be automated, per input keys */
    const formId = kebabCase(key);
    const form = document.querySelector('#' + formId);
    const submit = document.querySelector('#create-input-' + formId);

    if (!form || !submit) {
        console.error('form or submit button not found. check your name convention for the forms');
        return;
    }

    submit.addEventListener('click', function ($event) {
        // TODO: validate the input (using protocol?)
        $event.preventDefault();
        if(!form.reportValidity()) {
            return;
        }

        // Partner can send input data to their server for logging if they prefer,
        // in prototyping we are sending the input directly to api using sdk.
        const input = serializeForm(form);
        console.log('input:', input);
        // send input or create job via sdk
        api.createJobInput(input)
            .then(r => {
                submit.setAttribute('disabled', 'true');
                setTimeout(next, 1000);
            })
            .catch(e => alert(e));
    });
}


/*

window.onbeforeunload = function() {
    localStorage.setItem("name", $('#inputName').val());
    localStorage.setItem("email", $('#inputEmail').val());
    localStorage.setItem("phone", $('#inputPhone').val());
    localStorage.setItem("subject", $('#inputSubject').val());
    localStorage.setItem("detail", $('#inputDetail').val());
    // ...
}

window.onload = function() {

    const name = localStorage.getItem("name");
    if (name !== null) $('#inputName').val("name");

    // ...
}
*/

'use strict';

import { render } from './node_modules/lit-html/lit-html.js';
import FlowManager from './src/flow-manager';
import serialize from './src/serializer';
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

document.querySelector('#init').addEventListener('click', () => {
    init();
});

function init() {
    api.createJob().then(() => {});

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
        console.error('please check your meta');
        return;
    }

    /* waiting for output, if not - query to previous output */
    const template = templates[key];
    if (!template) {
        console.error(`template for ${key} not found`);
        //TODO: draw fallback page
        return;
    }

    if (meta.inputMethod === 'selectOne' && meta.sourceOutputKey != null) {
        //check job state and see if it's awaitingInput && key = selectedBreedType
        api.waitForJobOutput(meta.sourceOutputKey, (output) => {
            render(template(output.data), app);
            addSubmitter(key);
        });
    } else {
        render(template, app);
        addSubmitter(key);
    }
}

function addSubmitter(key) {
    /* this bits need to be automated, per input keys */
    const form = document.querySelector('#' + key);
    const submit = document.querySelector('#create-input-' + key);

    if (!form || !submit) {
        return;
    }

    submit.addEventListener('click', function () {
        // TODO: validate the input (using protocol?)
        if(!form.reportValidity()) {
            return;
        }

        const input = serialize(form);
        // send input or create job via sdk
        api.createInput(input)
            .then(r => {
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

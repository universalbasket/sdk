'use strict';

import kebabCase from 'lodash.kebabcase';
import { render } from './node_modules/lit-html/lit-html.js';
import FlowManager from './src/flow-manager';
import serializeForm from './src/serialize-form';
import sdk from './src/core';

/* templates */
import templates from './templates/index';

const SECTIONS = [
    {
        name: 'aboutYourPet',
        inputs: [
            { key: 'pets', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes' }
        ]
    },
    {
        name: 'aboutYou',
        inputs: [
            { key: 'owner', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedMaritalStatusOption', inputMethod: "SelectOne",  sourceOutputKey: 'availableMaritalStatusOptions' },/* in-flow, availableMaritalStatusOptions */
        ]
    },
    {
        name: 'selectedAddress',
        inputs: [
            { key: 'selectedAddress', inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses' }, /* in-flow, availableAddresses */
        ]
    },
    {
        name: 'aboutYourPolicy',
        inputs: [
            { key: 'policyOptions', inputMethod: null,  sourceOutputKey: null }
        ]
    },
    {
        name: 'selectedCover',
        inputs: [
            { key: 'selectedCover', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' }
        ]
    },
    {
        name: 'payment',
        inputs: [
            { key: 'payment', inputMethod: null, sourceOutputKey: null },
            { key: 'finalPriceConsent', inputMethod: "Consent", sourceOutputKey: "finalPrice" }
        ]
    }
];

const flowManager = new FlowManager(SECTIONS);
const app = document.querySelector('#app');

init();
/* document.querySelector('#init').addEventListener('click', () => {
    init();
}); */

function init() {
    sdk.create().then(() => {});

    flowManager.init();
    renderSection();
}

function next() {
    flowManager.next();
    renderSection();
}

function renderSection() {
    const section = flowManager.getCurrentSection();
    const template = templates[section];
    if (!template) {
        return render(templates.fallback(`template for ${section} not found`), app);
    }
    render(template(), app);
    addSubmitter(section);
}

function addSubmitter(section) {
    /* this bits need to be automated, per input keys */
    const formId = kebabCase(section);

    const form = document.querySelector('#' + formId);
    const submit = document.querySelector('#submit-' + formId);

    if (!form || !submit) {
        console.error('form or submit button not found. check your name convention for the forms');
        return;
    }

    submit.addEventListener('click', function () {
        // TODO: validate the input (using protocol?)
        if(!form.reportValidity()) {
            console.log('not valid form')
            return;
        }

        submit.setAttribute('disabled', 'true');

        // Partner can send input data to their server for logging if they prefer,
        // in prototyping we are sending the input directly to api using sdk.
        //TODO: update it to accept several inputs and send each of them separately
        const inputs = serializeForm(form);
        console.log('inputs:', inputs);
        // send input or create job via sdk
        sdk.createJobInputs(inputs)
        setTimeout(next, 1000);
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

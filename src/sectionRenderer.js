import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import templates from '../templates/index';

import cache from '../cache';

class Section {
    constructor(name, inputsMeta = [], selector, onFinish) {
        this.name = name;
        this.selector = selector;
        this.inputsMeta = inputsMeta;
        this.onFinish = onFinish;

        this.keysToRender = this.inputsMeta.map(nd => nd.key);
        this.keysRendered = [];
        this.cachedTemplates = [];

        Promise.resolve(this.init());
    }

    init() {
        if (!sdk.initiated) {
            try {
                sdk.retrieve();
                //TODO: if it's retrieved, check which input has provided. s
                // add submitted input to keysRendered, and render the next one.
            } catch (err) {
                window.location.hash = '/';
                return;
            }
        }

        this.renderWrapper();
        this.renderNextContent();
    }

    renderWrapper() {
        render(html``, document.querySelector(this.selector));
        render(templates.section(), document.querySelector(this.selector));
        this.addListener();
    }

    addListener() {
        const submitBtn = document.querySelector(`#submitBtn`);
        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
            const form = document.querySelector('form');
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            const inputs = serializeForm();

            // send input sdk
            sdk.createJobInputs(inputs)
                .then(submittedInputs => {
                    const event = new CustomEvent('submitinput', { detail: submittedInputs });
                    window.dispatchEvent(event);

                    if (this.keysToRender.length !== 0) {
                        render(html`Loading...`, document.querySelector('#next-of-pets')); //TODO: create template
                        this.renderNextContent();
                        submitBtn.removeAttribute('disabled');
                    } else {
                        render(html``, document.querySelector(this.selector));
                        this.onFinish();
                    }
                })
                .catch(err => {
                    if(document.querySelector('#error')) {
                        render(html`${err}`, document.querySelector('#error'));
                    }
                    submitBtn.removeAttribute('disabled');
                });
        });
    }

    renderNextContent() {
        const nextKey = this.keysToRender.shift();
        if (!nextKey) {
            return this.onFinish();
        }

        const inputMeta = this.inputsMeta.find(im => im.key === nextKey);

        //error handling?
        const template = templates.getInput(inputMeta);
        // render if the output is here.
        // when the awaitingInput event has happened, check nextKey and awaitingInputKey.
        // if it's different, skip this one, and render the awaitingInputKey.

        if (inputMeta.sourceOutputKey != null) {
            sdk.waitForJobOutput(inputMeta.sourceOutputKey, nextKey)
                .then(output => {
                    render(html`${template(inputMeta, output)}`, document.querySelector('#target'));

                    this.keysRendered.push(nextKey);
                })
                .catch(err => {
                    if (err.name === 'jobExpectsDifferentInputKey') {
                        console.log('got jobExpectsDifferentInputKey!', err.details.awaitingInputKey);

                        const input = this.inputsMeta.find(im => im.key === err.details.awaitingInputKey);
                        if (!input) {
                            // not found in this section! finish
                            return this.onFinish();
                        }

                        const idx = this.keysToRender.indexOf(input.key);
                        this.keysToRender.splice(idx, 1);
                        this.keysToRender.unshift(...[input.key, nextKey]);

                        return this.renderNextContent();
                    }
                });
        } else {
            render(html`${template(null, cache)}<div id="next-of-${inputMeta.key}"></div>`, document.querySelector('#target'));

            this.keysRendered.push(nextKey);
        }

    }
}

/**
 * @param {String} name
 * @param {Array} inputMeta
 * @param {Function} onFinish
 */
function getSection(name, inputMeta, selector, onFinish) {
    return new Section(name, inputMeta, selector, onFinish);
}

export default getSection;

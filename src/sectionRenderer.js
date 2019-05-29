import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import templates from '../templates/index';
import getSource from './get-source-with-priority';

class Section {
    constructor(name, screens = [], selector, onFinish) {
        this.name = name;
        this.selector = selector;
        this.screens = screens;
        this.onFinish = onFinish;

        this.screenToSubmit = this.screens.length;

        Promise.resolve(this.init());
    }

    init() {
        this.renderWrapper();
        this.renderScreens();
    }

    renderWrapper() {
        render(templates.section(), document.querySelector(this.selector));
        const wrappers = this.screens.map(screen => screen.key).map(key => {
            return html`<form id="screen-${key}"></form>`;
        });

        render(html`${wrappers.map(w => w)}`, document.querySelector('#target'))

        /* this.addListener(); */
    }

    addListener(key) {
        if (!sdk.initiated) {
            return;
        }

        const submitBtn = document.querySelector(`#submitBtn-${key}`);

        if (!submitBtn) {
            console.warn(`no button #submitBtn-${key} found`);
            return;
        }

        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
            const form = document.querySelector(`#screen-${key}`);
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            const inputs = serializeForm(`screen-${key}`);

            // send input sdk
            this.submitInputs(inputs);
        });
    }

    submitInputs(inputs) {
        sdk.createJobInputs(inputs)
            .then(submittedInputs => {
                this.screenToSubmit -= 1;
                const event = new CustomEvent('submitinput', { detail: submittedInputs });
                window.dispatchEvent(event);

                if (this.screenToSubmit === 0) {
                    render(html``, document.querySelector(this.selector));
                    this.onFinish();
                }
            })
            .catch(err => {
                if(document.querySelector('#error')) {
                    render(html`${err}`, document.querySelector('#error'));
                }
            });
    }

    skipScreen() {
        this.screenToSubmit -= 1;

        if (this.screenToSubmit === 0) {
            render(html``, document.querySelector(this.selector));
            this.onFinish();
        }
    }

    renderScreen({ key, waitFor = ''/* , submitOn:[button, onComplete] */}) {
        const template = templates.get(key, getDataForScreen);
        const selector = document.querySelector(`#screen-${key}`);
        const buttonTemplate = html`<button type="button" class="button button--right button--primary" id="submitBtn-${key}">Select</button>`;

        if(!template || !selector) {
            throw new Error('Template or selector not found, check the config');
        }

        /** build a promise function that applicable for all kind */
        function getDataForScreen() {
            return new Promise((res) => {
                if (!waitFor) {
                    return res({ data: null, skip: false });
                }

                const [type, sourceKey] = waitFor.split('.');
                const data = getSource(type, sourceKey);

                console.log('data in example', data);

                if (data === null) {
                    this.skipScreen();
                    return res({ data: null, skip: true });
                }

                if (data) {
                    return res({ data, skip: false });
                }

                sdk.waitForJobOutput(sourceKey, key)
                    .then(data => {
                        if (data === null) {
                            this.skipScreen();
                            return res({ data: null, skip: true });
                        }

                        return res({ data, skip: false });
                    });
            });
        }

        render(html`
                ${template}
                ${buttonTemplate}
            `, selector);
    }

    renderScreens() {
        this.screens.forEach(screen => {
            this.renderScreen(screen);
            this.addListener(screen.key);
        });
    }

/*
        //error handling?
        const template = templates.getInput(screen);
        // render if the output is here.
        // when the awaitingInput event has happened, check nextKey and awaitingInputKey.
        // if it's different, skip this one, and render the awaitingInputKey.

       if (screen.sourceOutputKey != null) {
            sdk.waitForJobOutput(screen.sourceOutputKey, nextKey)
                .then(output => {
                    render(html`${template(screen, output)}`, document.querySelector('#target'));

                    this.keysSubmitted.push(nextKey);
                })
                .catch(err => {
                    if (err.name === 'jobExpectsDifferentInputKey') {
                        console.log('got jobExpectsDifferentInputKey!', err.details.awaitingInputKey);

                        const input = this.screens.find(im => im.key === err.details.awaitingInputKey);
                        if (!input) {
                            // not found in this section! finish
                            return this.onFinish();
                        }

                        const idx = this.keysToSubmit.indexOf(input.key);
                        this.keysToSubmit.splice(idx, 1);
                        this.keysToSubmit.unshift(...[input.key, nextKey]);

                        return this.renderScreens();
                    }
                });
        } else {
            render(html`${template(null, cache)}<div id="next-of-${screen.key}"></div>`, document.querySelector('#target'));

            this.keysSubmitted.push(nextKey);
        } */

}

/**
 * @param {String} name
 * @param {Array} screens
 * @param {Function} onFinish
 */
function getSection(name, screens, selector, onFinish) {
    return new Section(name, screens, selector, onFinish);
}

export default getSection;

import kebabcase from '/web_modules/lodash.kebabcase.js';
import { html, render } from '/web_modules/lit-html/lit-html.js';
import sdk from './sdk.js';
import serializeForm from './serialize-form.js';
import getData from './get-data-with-priority.js'
import pageWrapper from './builtin-templates/page-wrapper.js';
import inlineLoading from './builtin-templates/inline-loading.js';
import * as Storage from './storage.js';
/**
 * @param {String} name
 * @param {Array} sections
 * @param {String} selector
 * @param {Function} onFinish
 */
class PageRenderer {
    constructor(name, sections = [], selector, onFinish) {
        this.name = name;
        this.selector = selector;
        this.sections = [...sections];
        this.onFinish = onFinish;

        this.sectionsToRender = sections.map(s => s.name);
        //this.sectionToSubmit = this.sections.length;
    }

    init() {
        this.renderWrapper();
    }

    renderWrapper() {
        render(pageWrapper(), document.querySelector(this.selector));
        const wrappers = this.sections.map(section => kebabcase(section.name)).map(name => {
            return html`<form id="section-form-${name}"></form>`;
        });

        render(html`${wrappers.map(w => w)}`, document.querySelector('#target'));
        this.next();
    }

    next() {
        const section = this.sections.shift();
        this.renderSection(section);
    }

    waitForVaultOutput() {
        return new Promise((resolve, reject) => {
            window.addEventListener("message", receiveOutput);
            function receiveOutput({ data: message }) {
                // Consider security concerns: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
                if (message.name === 'vault.output') {
                    window.removeEventListener('message', this);;
                    return resolve(message.data);
                }

                if (message.name === 'vault.validationError' || message.name === 'vault.error') {
                    window.removeEventListener('message', this);;
                    return reject(message.name)
                }
            }
        });
    }


    addListeners(name) {
        if (!sdk.initiated) {
            return;
        }

        const submitBtn = document.querySelector(`#submit-btn-${name}`);
        const cancelBtn = document.querySelector('#cancel-btn');
        const hostedForm = document.querySelector('#vault-iframe');
        const form = document.querySelector(`#section-form-${name}`);
        const vaultListener = () => {
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            hostedForm.contentWindow.postMessage('vault.submit', '*');
            this.waitForVaultOutput()
                .then(({ cardToken, panToken }) => {
                    console.log('tokens issued:', cardToken, panToken );
                    submitBtn.setAttribute('disabled', 'true');
                    const inputs = serializeForm(`#section-form-${name}`);

                    if (inputs.payment)  inputs.payment['card'] = { '$token': cardToken };
                    inputs['panToken'] = panToken;

                    return sdk.createJobInputs(inputs);
                })
                .then(submittedInputs => {
                    const event = new CustomEvent('submitinput', { detail: submittedInputs });
                    window.dispatchEvent(event);

                    if (this.sections.length === 0) {
                        render(html``, document.querySelector(this.selector));
                        this.onFinish();
                    } else {
                        form.classList.add('form--disabled');
                        [...form.querySelectorAll('input')].forEach(_ => _.setAttribute('disabled', 'disabled'));
                        this.next();
                    }
                })
                .catch(err => {
                    if (document.querySelector('#error')) {
                        render(html`${err}`, document.querySelector('#error'));
                    }
                    submitBtn.removeAttribute('disabled');
                });
        }

        const defaultListener = () => {
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            const inputs = serializeForm(`#section-form-${name}`);

            // send input sdk
            sdk.createJobInputs(inputs)
                .then(submittedInputs => {
                    const event = new CustomEvent('submitinput', { detail: submittedInputs });
                    window.dispatchEvent(event);

                    if (this.sections.length === 0) {
                        render(html``, document.querySelector(this.selector));
                        this.onFinish();
                    } else {
                        form.classList.add('form--disabled');
                        [...form.querySelectorAll('input')].forEach(_ => _.setAttribute('disabled', 'disabled'));
                        this.next();
                    }
                })
                .catch(err => {
                    if (document.querySelector('#error')) {
                        render(html`${err}`, document.querySelector('#error'));
                    }
                    submitBtn.removeAttribute('disabled');
                });
        }

        const listener = hostedForm ? vaultListener : defaultListener;
        submitBtn.addEventListener('click', listener);

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                sdk.sdk.cancelJob().then(res => {
                    window.location.hash = '/error';
                });
            })
        }
    }

    skipSection() {
        if (this.sections.length === 0) {
            render(html``, document.querySelector(this.selector));
            this.onFinish();
        } else {
            this.next();
        }
    }

    renderSection({ name, waitFor, template}) {
        const nameForElement = kebabcase(name);
        const selector = document.querySelector(`#section-form-${nameForElement}`);
        if (!waitFor) {
           render(html`${template(nameForElement)} `, selector);
           this.addListeners(nameForElement);
           return;
        }

        render(html`${inlineLoading()} `, selector)

        this.getDataForSection(waitFor)
            .then(res => {
                render(html`${template(nameForElement, res)} `, selector);
                this.addListeners(nameForElement);
            })
    }

    getDataForSection(waitFor) {
        return new Promise((res) => {
            const results = waitFor.map(_ => {
                const [type, sourceKey] = _.split('.');
                const data = getData(type, sourceKey);

                if (data === null) { //skip: true,
                    return { data: null, skip: true, sourceKey };
                }

                if (data) {
                    return { data, skip: false, sourceKey };
                }

                return { data: null, skip: false, sourceKey };
            });

            const keysToWaitFor = results.filter(r => r.data == null && r.skip === false).map(r => r.sourceKey);

            if (keysToWaitFor.length === 0) {
                const dataWaitFor = {};
                results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

                return res(dataWaitFor);
            }

            const dataWaitFor = {};
            results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

            const stop = sdk.trackJobOutput((message) => {
                if (message === 'outputCreate') {
                    const { outputs } = Storage.getAll();
                    const allAvailable = keysToWaitFor.every(k => outputs[k]);

                    if (allAvailable) {
                        keysToWaitFor.forEach(k => dataWaitFor[k] = outputs[k]);
                        stop();

                        res(dataWaitFor);
                    }
                }
            })
        });
    }
}



function getPageRenderer(name, sections, selector, onFinish) {
    return new PageRenderer(name, sections, selector, onFinish);
}

export default getPageRenderer;

import kebabcase from '/web_modules/lodash.kebabcase/index.js';
import { serializeForm , getFormInputKeys } from './serialize-form.js';
import defaultLoadingTemplate from './builtin-templates/loading.js';
import flashError from './builtin-templates/flash-error.js';
import { get as storageGet, getAll as storageGetAll, set as storageSet, del as storageDel } from './storage.js';
import waitForDataForSection from './wait-for-data-for-section.js';
import { createInputs } from './main.js';
import setupForm from './setup-form.js';

const VAULT_FORM_SELECTOR = '.vault-form';

class PageRenderer {
    constructor({ sdk, sections = [], cache, selector, onFinish, inputKeys = [], inputFields, outputKeys = [] }) {
        if (sections.length === 0) {
            throw new Error('PageRenderer constructor: sections is empty');
        }

        this.sdk = sdk;
        this.selector = selector;
        this.sections = sections.slice();
        this.onFinish = onFinish;
        this.inputKeys = inputKeys;
        this.inputFields = inputFields;
        this.outputKeys = outputKeys;

        this.sectionsToRender = [];

        for (const section of sections) {
            const sectionToRender = { name: kebabcase(section.name), ...section, cache: cache.slice() };
            this.sectionsToRender.push(sectionToRender);
        }

        this.currentSection = null;
    }

    init() {
        this.renderWrapper();
    }

    scrollIntoView(target, offset) {
        if (typeof offset === 'undefined') {
            offset = - target.parentElement.offsetTop - 40; // 40px is a bit of space to show where we've come from
        }

        setTimeout(() => {
            window.scrollTo(0, target.offsetTop + offset);
        }, 300);
    }

    renderWrapper() {
        const target = document.createElement('div');
        target.className = 'page__body';

        for (const section of this.sectionsToRender) {
            const form = document.createElement('form');
            form.id = `section-form-${section.name}`;
            target.appendChild(form);
        }

        const page = document.createElement('div');
        page.className = 'page';

        page.appendChild(target);
        document.querySelector(this.selector).appendChild(page);

        this.next();
    }

    next() {
        const section = this.sectionsToRender.shift();
        if (!section) {
            console.info('PageRenderer next: no section to render.');
            const container = document.querySelector(this.selector);

            while (container.lastChild) {
                container.removeChild(container.lastChild);
            }

            return this.onFinish();
        }

        this.currentSection = section;
        this.renderSection(section);
    }

    addListeners(name) {
        const submitBtn = document.querySelector(`#submit-btn-${name}`);

        if (!submitBtn) {
            console.warn(`submit button for ${name} section not found.`);
            return;
        }

        const sectionForm = document.querySelector(`#section-form-${name}`);

        this.scrollIntoView(sectionForm);

        submitBtn.addEventListener('click', e => {
            flashError().hide();

            if (sectionForm && !sectionForm.reportValidity()) {
                flashError().show();

                const vaultIframe = document.querySelector(VAULT_FORM_SELECTOR);
                if (vaultIframe) {
                    vaultIframe.contentWindow.postMessage('vault.submit', '*');
                }

                return;
            }

            e.target.setAttribute('disabled', 'true');

            this.submitVaultFormIfPresents()
                .then(() => {
                    const inputs = serializeForm(`#section-form-${name}`);
                    return this.createInputs(inputs);
                })
                .then(() => {
                    this.disableSection(name);
                    this.next();
                })
                .catch(err => {
                    flashError(err).show();
                    e.target.removeAttribute('disabled');
                });
        });
    }

    submitVaultFormIfPresents() {
        const vaultIframe = document.querySelector(VAULT_FORM_SELECTOR);

        if (!vaultIframe) {
            return Promise.resolve();
        }

        if (vaultIframe) {
            return submitVaultForm(this.sdk, vaultIframe)
                .then(({ cardToken, panToken }) => {
                    storageDel('_', 'otp');
                    storageSet('_', 'cardToken', cardToken);
                    storageSet('_', 'panToken', panToken);
                    vaultIframe.classList.add('submitted');
                });
        }
    }

    createInputs(inputs) {
        let cardTokenSent = false;
        let panTokenSent = false;

        if (inputs.payment) {
            const cardToken = storageGet('_', 'cardToken');
            const panToken = storageGet('_', 'panToken');

            if (cardToken) {
                inputs.payment.card = { '$token': cardToken };
                cardTokenSent = true;
            } else {
                // eslint-disable-next-line no-warning-comments
                // TODO: include this part in doc:
                // you need include payment form within same section or put the payment form in any previous sections so that cardToken can be included.
                console.warn('cardToken not found while submitting payment input.');
            }

            if (panToken) {
                inputs.panToken = panToken;
                panTokenSent = true;
            }
        }

        return createInputs(this.sdk, inputs)
            .then(() => {
                if (cardTokenSent) {
                    storageDel('_', 'cardToken');
                }

                if (panTokenSent) {
                    storageDel('_', 'panToken');
                }
            });
    }

    skipSection(name) {
        console.log(`Section ${name} skipped.`);

        this.disableSection(name);

        const vaultForm = document.querySelector(VAULT_FORM_SELECTOR);
        if (vaultForm) {
            vaultForm.classList.add('submitted');
        }

        const submitButton = document.querySelector(`#submit-btn-${name}`);
        if (submitButton) {
            submitButton.setAttribute('disabled', 'disabled');
        }

        this.next();
    }

    disableSection(name) {
        const sectionForm = document.querySelector(`#section-form-${name}`);
        if (sectionForm) {
            sectionForm.classList.add('form--disabled');
            const fields = [
                ...sectionForm.querySelectorAll('input'),
                ...sectionForm.querySelectorAll('select')
            ];
            fields.forEach(_ => _.setAttribute('disabled', 'disabled'));

            const enableListener = () => {
                if (confirm('Are you sure you wish to go back?')) {
                    this.enableSection(name);
                    sectionForm.removeEventListener('click', enableListener);
                }
            };

            sectionForm.addEventListener('click', enableListener);
        }
    }

    async enableSection(name) {
        const sectionForm = document.querySelector(`#section-form-${name}`);
        if (sectionForm) {
            sectionForm.classList.remove('form--disabled');
            const fields = [
                ...sectionForm.querySelectorAll('input'),
                ...sectionForm.querySelectorAll('select'),
                ...sectionForm.querySelectorAll('button')
            ];
            fields.forEach(_ => _.removeAttribute('disabled'));

            // reset job to this input
            const { input } = storageGetAll();
            const submittedInputKeys = Object.keys(input);
            const inputKeysInSection = getFormInputKeys(`#section-form-${name}`);

            const submittedKeysInSection = inputKeysInSection.map(k => submittedInputKeys.includes(k) ? k : null).filter(k => k);

            if (submittedKeysInSection.length > 0) {
                const preserveInputs = submittedInputKeys.filter(k => !submittedKeysInSection.includes(k));
                await this.sdk.resetJob(inputKeysInSection[0], preserveInputs);
                this.sectionsToRender.unshift(this.currentSection);

                // clear all of the job outputs
                const { output } = storageGetAll();
                Object.keys(output).forEach(key => {
                    storageDel('output', key);
                });
            }
        }

        // remove the next forms
        let nextForm = sectionForm.nextSibling;
        while (nextForm) {
            nextForm.innerHTML = '';
            nextForm = nextForm.nextSibling;
        }
    }

    renderSection({ name, waitFor, cache, template, loadingTemplate }) {
        const sectionForm = document.querySelector(`#section-form-${name}`);

        if (!sectionForm) {
            throw new Error('No section form ' + name);
        }

        if (loadingTemplate) {
            loadingTemplate(sectionForm);
        } else {
            defaultLoadingTemplate(sectionForm);
        }

        this.scrollIntoView(sectionForm);

        waitForDataForSection(waitFor, cache)
            .then(() => {
                const renderer = this;

                while (sectionForm.firstChild) {
                    sectionForm.removeChild(sectionForm.firstChild);
                }

                let skipped = false;

                const rendered = template({
                    name,
                    skip() {
                        if (!skipped) {
                            skipped = true;
                            renderer.skipSection(name);
                        }
                    },
                    sdk: this.sdk,
                    inputKeys: this.inputKeys.slice(),
                    outputKeys: this.outputKeys.slice(),
                    inputFields: this.inputFields,
                    storage: {
                        get: storageGet
                    }
                });

                // Synchronous skipping means we can avoid rendering this section.
                if (skipped) {
                    return;
                }

                if (!(rendered instanceof Node)) {
                    throw new TypeError(`Invalid template result for ${name}. Should return a Node, returned: ${rendered} (${typeof rendered})`);
                }

                sectionForm.appendChild(rendered);

                setupForm(sectionForm);
                this.addListeners(name);
                this.skipIfSubmitted(name);
            });
    }

    skipIfSubmitted(name) {
        const { input } = storageGetAll();
        const submittedInputKeys = Object.keys(input);
        const inputKeysInSection = getFormInputKeys(`#section-form-${name}`);

        if (inputKeysInSection.length === 0) {
            return;
        }

        /**
         * all input keys submitted -> skip section
         * part of the input keys submitted -> reset job, preserve input keys = submittedInputKeys - part of the keys submitted
         * none of keys submitted -> do nothing
        */
        const submittedKeysInSection = inputKeysInSection.map(k => submittedInputKeys.includes(k) ? k : null).filter(k => k);
        //all submitted
        if (submittedKeysInSection.length === inputKeysInSection.length) {
            return this.skipSection(name);
        }

        if (submittedKeysInSection.length > 0) {
            const preserveInputs = submittedInputKeys.filter(k => !submittedKeysInSection.includes(k));

            this.sdk.resetJob(inputKeysInSection[0], preserveInputs)
                .then(() => {
                    submittedKeysInSection.forEach(k => localStorage.removeItem(`input.${k}`));
                })
                .catch(_err => window.location.hash = '/error');
        }
    }
}

function submitVaultForm(sdk, vaultIframe) {
    return new Promise((resolve, reject) => {
        if (!vaultIframe) {
            reject('vault iframe not found');
        }

        window.addEventListener('message', receiveOutput);
        vaultIframe.contentWindow.postMessage('vault.submit', '*');

        function receiveOutput({ data: message }) {
            if (message.name === 'vault.validation') {
                if (message.data.isValid) {
                    window.removeEventListener('message', receiveOutput);
                }
                flashError().hide();
                return;
            }

            if (message.name === 'vault.output') {
                window.removeEventListener('message', receiveOutput);
                return resolve(message.data);
            }

            if (message.name === 'vault.validationError') {
                return reject(message.name);
            }

            if (message.name === 'vault.error') {
                reject(message.name);
                sdk.cancelJob().then(() => window.location.hash = '/error');
            }
        }
    });
}

function getPageRenderer({ sdk, name, sections, cache, selector, onFinish, inputKeys, inputFields, outputKeys }) {
    return new PageRenderer({ sdk, name, sections, cache, selector, onFinish, inputKeys, inputFields, outputKeys });
}

export default getPageRenderer;

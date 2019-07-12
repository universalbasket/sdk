import kebabcase from '/web_modules/lodash.kebabcase.js';
import { serializeForm , getFormInputKeys } from './serialize-form.js';
import pageWrapper from './builtin-templates/page-wrapper.js';
import defaultLoadingTemplate from './builtin-templates/loading.js';
import flashError from './builtin-templates/flash-error.js';
import * as Storage from './storage.js';
import getDataForSection from './get-data-for-section.js';
import { createInputs } from './main.js';
import setupForm from './setup-form.js';

const VAULT_FORM_SELECTOR = '#ubio-vault-form';

/**
 * @param {String} name
 * @param {Array} sections
 * @param {String} selector
 * @param {Function} onFinish
 */
class PageRenderer {
    constructor(sdk, sections = [], selector, onFinish) {
        if (sections.length === 0) {
            throw new Error('PageRenderer constructor: sections is empty');
        }

        this.sdk = sdk;
        this.selector = selector;
        this.sections = [...sections];
        this.onFinish = onFinish;

        this.sectionsToRender = [];

        for (const section of sections) {
            const sectionToRender = { elementName: kebabcase(section.name), ...section };
            this.sectionsToRender.push(sectionToRender);
        }

        this.currentSection = null;
    }

    init() {
        this.renderWrapper();
    }

    renderWrapper() {
        document.querySelector(this.selector).innerHTML = pageWrapper();

        const wrappers = this.sectionsToRender.map(section => {
            const form = document.createElement('form');
            form.id = `section-form-${section.elementName}`;
            return form;
        });
        const target = document.querySelector('#target');

        while (target.lastChild) {
            target.removeChild(target.lastChild);
        }

        target.append(...wrappers);

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

    addListeners(elementName) {
        const submitBtn = document.querySelector(`#submit-btn-${elementName}`);

        if (!submitBtn) {
            console.warn(`submit button for ${elementName} section not found.`);
            return;
        }

        const sectionForm = document.querySelector(`#section-form-${elementName}`);

        sectionForm.scrollIntoView(true);

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
                    const inputs = serializeForm(`#section-form-${elementName}`);
                    return this.createInputs(inputs);
                })
                .then(() => {
                    this.disableSection(elementName);
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
                    Storage.del('_', 'otp');
                    Storage.set('_', 'cardToken', cardToken);
                    Storage.set('_', 'panToken', panToken);

                    vaultIframe.setAttribute('id', `${VAULT_FORM_SELECTOR}-submitted`);
                });
        }
    }

    createInputs(inputs) {
        let cardTokenSent = false;
        let panTokenSent = false;

        if (inputs.payment) {
            const cardToken = Storage.get('_', 'cardToken');
            const panToken = Storage.get('_', 'panToken');

            if (cardToken) {
                inputs.payment.card = { '$token': cardToken };
                cardTokenSent = true;
            } else {
                //TODO: include this part in doc:
                //you need include payment form within same section or put the payment form in any previous sections so that cardToken can be included.
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
                    Storage.del('_', 'cardToken');
                }

                if (panTokenSent) {
                    Storage.del('_', 'panToken');
                }
            });
    }

    skipSection(elementName) {
        this.disableSection(elementName);

        const vaultForm = document.querySelector(VAULT_FORM_SELECTOR);
        if (vaultForm) {
            vaultForm.setAttribute('id', `${VAULT_FORM_SELECTOR}-submitted`);
        }

        const submitButton = document.querySelector(`#submit-btn-${elementName}`);
        if (submitButton) {
            submitButton.setAttribute('disabled', 'disabled');
        }

        this.next();
    }

    disableSection(elementName) {
        const sectionForm = document.querySelector(`#section-form-${elementName}`);
        if (sectionForm) {
            sectionForm.classList.add('form--disabled');
            const fields = [
                ...sectionForm.querySelectorAll('input'),
                ...sectionForm.querySelectorAll('select')
            ];
            fields.forEach(_ => _.setAttribute('disabled', 'disabled'));
        }
    }

    renderSection({ elementName, waitFor, template, loadingTemplate }) {
        const sectionForm = document.querySelector(`#section-form-${elementName}`);

        if (loadingTemplate) {
            loadingTemplate(sectionForm);
        } else {
            defaultLoadingTemplate(sectionForm);
        }

        sectionForm.scrollIntoView(true);

        const skip = () => {
            this.skipSection();
        };

        getDataForSection(waitFor)
            .then(res => {
                while (sectionForm.firstChild) {
                    sectionForm.removeChild(sectionForm.firstChild);
                }

                const rendered = template(elementName, res, skip, this.sdk);

                if (!(rendered instanceof Node)) {
                    throw new TypeError(`Invalid template result. Should return a Node, returned: ${rendered}`);
                }

                sectionForm.appendChild(rendered);

                setupForm(sectionForm);
                this.addListeners(elementName);
                this.skipIfSubmitted(elementName);
            });
    }

    skipIfSubmitted(elementName) {
        const { inputs } = Storage.getAll();
        const submittedInputKeys = Object.keys(inputs);
        const inputKeysInSection = getFormInputKeys(`#section-form-${elementName}`);

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
            return this.skipSection(elementName);
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

function getPageRenderer(sdk, name, sections, selector, onFinish) {
    return new PageRenderer(sdk, name, sections, selector, onFinish);
}

export default getPageRenderer;

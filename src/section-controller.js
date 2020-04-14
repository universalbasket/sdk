import storage from './storage.js';
import { waitForData, checkForExistingKeys } from './wait-for-data.js';
import { serializeForm } from './serialize-form.js';

export default class SectionController {
    constructor({ sdk, cache, mountPoint, service, section, page, nextRoute }) {
        this.sdk = sdk;
        this.cache = cache;
        this.mountPoint = mountPoint;
        this.cache = cache;
        this.service = service;
        this.section = section;
        this.page = page;
        this.nextRoute = nextRoute;
    }

    // renders the HTML template and appends to the mountPoint node
    async render() {
        const options = {
            storage,
            sdk: this.sdk,
            page: this.page,
            section: this.section,
            skip: this.skip
        };

        // only show loading screen if waitFor explicitly defined
        if (this.section.waitFor) {
            // only show if we haven't already loaded the keys
            if (checkForExistingKeys(this.section.waitFor, this.cache).length > 0) {
                const loadingNode = this.section.loadingTemplate(options);
                this.displayNode(loadingNode);

                // wait until all data is present
                await waitForData(this.section.waitFor, this.cache);
            }
        }

        // render the section with its template
        const sectionNode = this.section.template({ name: this.section.name, ...options });
        this.displayNode(sectionNode);

        this.addEventListeners();
        this.populateForm(storage.getAll().input);
    }
    
    // displays the specified node in the mountPoint
    displayNode(node) {
        this.mountPoint.innerHTML = '';
        this.mountPoint.appendChild(node);
    }

    // hooks up the form submit event listener to post input data to API
    addEventListeners() {
        const forms = this.mountPoint.querySelectorAll('form');
        for (const form of forms) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitForm(form);
            });
        }
    }

    // populates any HTML forms with input data previously submitted
    populateForm(inputData, prefix) {
        Object.keys(inputData).forEach((key1) => {
            const data1 = inputData[key1];

            if (typeof data1 === 'string') {
                this.populateField(prefix ? `${prefix}[${key1}]`:key1, data1);
            } else {
                Object.keys(data1).forEach((key2) => {
                    const data = inputData[key1][key2];
                    this.populateForm(data1, prefix ? `${prefix}[${key1}]`:key1, data1);
                });
            }
        });
    }

    // populates a single field with its previously submitted value
    populateField(fieldName, value) {
        const field = document.querySelector(`*[name=${fieldName.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}]`);
        if (field) {
            field.value = value;
        }
    }

    async submitVaultForm(iframe) {
        return new Promise((resolve, reject) => {
            function processVaultMessage({ data: message }) {
                if (message.name === 'vault.validation') {
                    return;
                }

                if (message.name === 'vault.output') {
                    resolve(message.data);
                }

                if (message.name === 'vault.validationError') {
                    reject(message.name);
                }

                if (message.name === 'vault.error') {
                    reject(message.name);
                }

                window.removeEventListener('message', processVaultMessage);
            }

            window.addEventListener('message', processVaultMessage);
            iframe.contentWindow.postMessage('vault.submit', '*');
        });
    }

    // submits the form via AJAX
    async submitForm(form) {
        // 0. submit any vault forms if present
        const vaultFrames = form.querySelectorAll('iframe.vault-form');

        if (vaultFrames.length > 0) {
            for (let i=0; i<vaultFrames.length; i++) {
                try {
                    const res = await this.submitVaultForm(vaultFrames[i]);
                    const fields = JSON.parse(vaultFrames[i].getAttribute('fields'));
                    
                    // set the values of the hidden inputs for cardToken and panToken
                    document.querySelector(`input[name=${fields.cardToken.replace(/([\[\]\$])/g, '\\$1')}`).value = res.cardToken;
                    document.querySelector(`input[name=${fields.panToken.replace(/([\[\]\$])/g, '\\$1')}`).value = res.panToken;
                } catch (err) {
                    console.warn('err', err);
                    window.scrollTo(0, vaultFrames[i].clientTop);

                    return;
                }
            }
        }

        // 1. serialise form
        const inputs = serializeForm(form);
        const firstInputKey = Object.keys(inputs)[0];
        
        // 2. check input keys to see if they've already been submitted
        if (storage.get('input', firstInputKey)) {
            // check similarity vs previous inputs
            const previousInputs = storage.getAll().input;
            let previousInputsSame = true;

            Object.keys(inputs).forEach((key) => {
                if (JSON.stringify(inputs[key]) != JSON.stringify(previousInputs[key])) {
                    previousInputsSame = false;
                }
            });

            // if all input data is the same, just go next();
            if (previousInputsSame) {
                return this.next();
            }

            // delete previous inputs and reset
            storage.delAllBefore('input', firstInputKey);
            const preserveInputs = Object.keys(storage.getAll()['input']);

            // 3. reset if necessary
            await this.sdk.resetJob(firstInputKey, preserveInputs);
        }

        // 4. submit inputs
        try {
            // disable submit buttons so they can't be clicked twice
            const submitButtons = form.querySelectorAll('button[type=submit], input[type=submit]');
            [...submitButtons].forEach((button) => {
                button.disabled = true;
            });

            await this.createInputs(this.sdk, inputs);
        } catch (err) {
            // TODO: handle error

            return;
        }

        // 5. navigate to next section
        this.next();
    }

    // skips this section
    skip() {
        this.next();
    }

    // goes to the next route
    next() {
        if (this.nextRoute) {
            window.location.hash = '#' + this.nextRoute;
        }
    }

    // send inputs to the API
    async createInputs(sdk, inputs) {
        const submittedInputs = [];
    
        for (const [rawKey, rawData] of Object.entries(inputs)) {
            // vault raw pan if passed in to sdk
            const { key, data } = rawKey === 'pan' ?
                { key: 'panToken', data: await sdk.vaultPan(rawData) } :
                { key: rawKey, data: rawData };
    
            // send input to API
            await sdk.createJobInput(key, data);
    
            storage.set('input', key, data);
            submittedInputs.push({ key, data });
        }
    
        window.dispatchEvent(new CustomEvent('newInputs', { detail: submittedInputs }));
    }
    
}
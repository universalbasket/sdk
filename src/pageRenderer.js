import kebabcase from 'lodash.kebabcase';
import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import getData from './get-data-with-priority'
import pageTemplate from './builtin-template/page';
import inlineLoading from './builtin-template/inline-loading';
import * as Storage from './storage';
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
        render(pageTemplate(), document.querySelector(this.selector));
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

    addListener(name) {
        if (!sdk.initiated) {
            return;
        }

        const submitBtn = document.querySelector(`#submit-btn-${name}`);

        if (!submitBtn) {
            console.warn(`no button #submit-btn-${name} found`);
            return;
        }

        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
            const form = document.querySelector(`#section-form-${name}`);
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
        });
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
           this.addListener(nameForElement);
           return;
        }

        render(html`${inlineLoading()} `, selector)

        this.getDataForSection(waitFor)
            .then(res => {
                render(html`${template(nameForElement, res)} `, selector);
                this.addListener(nameForElement);
            })
    }

    getDataForSection(waitFor) {
        return new Promise((res) => {
            const results = waitFor.map(_ => {
                const [type, sourceKey] = _.split('.');
                const data = getData(type, sourceKey);

                if (data === null) { //skip: true,
                    this.skipSection();
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

            console.log('keysToWaitFor', keysToWaitFor);
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

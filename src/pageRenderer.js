import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import pageTemplate from './builtin-template/page';
import getSource from './get-source-with-priority';
import renderSection from './renderSection';

class PageRenderer {
    constructor(name, sections = [], selector, onFinish) {
        this.name = name;
        this.selector = selector;
        this.sections = sections;
        this.onFinish = onFinish;

        this.sectionToSubmit = this.sections.length;

        Promise.resolve(this.init());
    }

    init() {
        this.renderWrapper();
        //this.renderSections();
    }

    renderWrapper() {
        render(pageTemplate(), document.querySelector(this.selector));
        const wrappers = this.sections.map(section => section.name).map(name => {
            return html`<form id="section-${name}"></form>`;
        });

        render(html`${wrappers.map(w => w)}`, document.querySelector('#target'));
    }

    addListener(name) {
        if (!sdk.initiated) {
            return;
        }

        const submitBtn = document.querySelector(`#submitBtn`);

        if (!submitBtn) {
            console.warn(`no button #submitBtn found`);
            return;
        }

        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
            const form = document.querySelector(`#section-${name}`);
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            const inputs = serializeForm(`#section-${name}`);

            // send input sdk
            this.submitInputs(inputs);
        });
    }

    submitInputs(inputs) {
        sdk.createJobInputs(inputs)
            .then(submittedInputs => {
                this.sectionToSubmit -= 1;
                const event = new CustomEvent('submitinput', { detail: submittedInputs });
                window.dispatchEvent(event);

                if (this.sectionToSubmit === 0) {
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

    skipSection() {
        this.sectionToSubmit -= 1;

        if (this.sectionToSubmit === 0) {
            render(html``, document.querySelector(this.selector));
            this.onFinish();
        }
    }

    renderSection({ name, waitFor, template/* , submitOn:[button, onComplete] */}) {
        const templateTo = renderSection(template, getDataForSection);
        const selector = document.querySelector(`#section-${name}`);

        if(!templateTo || !selector) {
            throw new Error('Template or selector not found, check the config');
        }

        render(html`${templateTo} `, selector);

        function getDataForSection() {
            return new Promise((res) => {
                if (!waitFor || waitFor.length === 0) {
                    return res({ data: null, skip: false });
                }

                //TODO:for now, until making the outputcreatelistner
                const [type, sourceKey] = waitFor[0].split('.');
                const data = getSource(type, sourceKey);


                if (data === null) {
                    this.skipSection();
                    return res({ data: null, skip: true });
                }

                if (data) {
                    return res({ data, skip: false });
                }

                sdk.waitForJobOutput(sourceKey)
                    .then(data => {
                        if (data === null) {
                            this.skipSection();
                            return res({ data: null, skip: true });
                        }

                        return res({ data, skip: false });
                    });
            });
        }
    }

    renderSections() {
        this.sections.forEach(section => {
            try {
                this.renderSection(section);
                this.addListener(section.name);
            } catch(err) {
                console.error(err);
            }
        });
    }
}

/**
 * @param {String} name
 * @param {Array} sections
 * @param {Function} onFinish
 */

function getPageRenderer(name, sections, selector, onFinish) {
    return new PageRenderer(name, sections, selector, onFinish);
}

export default getPageRenderer;

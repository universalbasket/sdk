import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import sectionTemplate from '../templates/section';
import getSource from './get-source-with-priority';
import renderScreen from './renderScreen';

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
        render(sectionTemplate(), document.querySelector(this.selector));
        const wrappers = this.screens.map(screen => screen.name).map(name => {
            return html`<form id="screen-${name}"></form>`;
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
            const form = document.querySelector(`#screen-${name}`);
            if (!form.reportValidity()) {
                console.log('invalid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            const inputs = serializeForm(`screen-${name}`);

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

    renderScreen({ name, waitFor, template/* , submitOn:[button, onComplete] */}) {
        const templateTo = renderScreen(template, getDataForScreen);
        const selector = document.querySelector(`#screen-${name}`);

        if(!templateTo || !selector) {
            throw new Error('Template or selector not found, check the config');
        }

        render(html`
                ${templateTo}
            `, selector);

        function getDataForScreen() {
            return new Promise((res) => {
                if (!waitFor || waitFor.length === 0) {
                    return res({ data: null, skip: false });
                }

                //TODO:for now, until making the outputcreatelistner
                const [type, sourceKey] = waitFor[0].split('.');
                const data = getSource(type, sourceKey);

                console.log('data in example', data);

                if (data === null) {
                    this.skipScreen();
                    return res({ data: null, skip: true });
                }

                if (data) {
                    return res({ data, skip: false });
                }

                sdk.waitForJobOutput(sourceKey)
                    .then(data => {
                        if (data === null) {
                            this.skipScreen();
                            return res({ data: null, skip: true });
                        }

                        return res({ data, skip: false });
                    });
            });
        }
    }

    renderScreens() {
        this.screens.forEach(screen => {
            try {
                this.renderScreen(screen);
                this.addListener(screen.name);
            } catch(err) {
                console.error(err);
            }
        });
    }
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

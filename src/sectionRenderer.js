import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import templates from '../templates/index';

class Section {
    /**
     * @param {String} name
     * @param {String} title
     * @param {Array} inputsMeta
     * @param {Function} onFinish
     */

    constructor(name, title, inputsMeta = [], selector, onFinish) {
        this.name = name;
        this.title = title || name;
        this.selector = selector;
        this.inputsMeta = inputsMeta;
        this.onFinish = onFinish;

        this.keysToRender = this.inputsMeta.map(nd => nd.key);
        this.keysRendered = [];
        this.cachedTemplates = [];

        Promise.resolve(this.init());
    }

    async init() {
        if (!sdk.initiated) {
            try {
                await sdk.retrieve();
                //TODO: if it's retrieved, check which input has provided. s
                // add submitted input to keysRendered, and render the next one.
            } catch (err) {
                window.location.href = '/';
                return;
            }
        }

        this.renderWrapper();
        this.renderNextContent();
    }

    renderWrapper() {
        render(html``, document.querySelector(this.selector));
        render(templates.section(this.title), document.querySelector(this.selector));
        this.addListener();
    }

    addListener() {
        const submitBtn = document.querySelector(`#submitBtn`);
        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
            const form = document.querySelector('form');
            if (!form.reportValidity()) {
                console.log('not valid form');
                return;
            }

            submitBtn.setAttribute('disabled', 'true');

            // Partner can send input data to their server for logging if they prefer,
            // in prototyping we are sending the input directly to api using sdk.
            //TODO: update it to accept several inputs and send each of them separately
            const inputs = serializeForm();

            // send input sdk
            sdk.createJobInputs(inputs)
                .then(res => {
                    if (this.keysToRender.length !== 0) {
                        render(html`Loading...`, document.querySelector('#target'))
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

        const template = templates.getInput(inputMeta);
        // render if the output is here.
        // when the awaitingInput event has happened, check nextKey and awaitingInputKey.
        // if it's different, skip this one, and render the awaitingInputKey.
        if (inputMeta.inputMethod != null) {
            sdk.waitForJobOutput(inputMeta.sourceOutputKey, nextKey)
                .then(output => {
                    console.log('got an output!');
                    render(html`${template(inputMeta, output)}`, document.querySelector('#target'));
                    document.querySelector('.section').scrollIntoView(true);

                    this.keysRendered.push(nextKey);

                })
                .catch(err => {
                    if (err.name === 'jobExpectsDifferentInputKey') {
                        console.log('got jobExpectsDifferentInputKey!');

                        const input = this.inputsMeta.find(im => im.key === err.details.awaitingInputKey);
                        if (!input) {
                            // not found in this section! finish
                            return this.onFinish();
                        }

                        const idx = this.keysToRender.indexOf(input.key);
                        this.keysToRender.splice(idx, 1);
                        this.keysRendered.unshift([input.key, nextKey]);

                        return this.renderNextContent();

                    }
                });
        } else {
            render(html`${template()}`, document.querySelector('#target'));
            document.querySelector('.section').scrollIntoView(true);

            this.keysRendered.push(nextKey);
        }

    }
/*
    onFinish() {
        setTimeout(() => { window.location.hash = this.nextRoute }, 1000);
    } */
}

/* const AboutYourPet = () => { new Section('aboutYourPet', 'Tell me about your pet', SECTIONS[0].inputs, '/about-you') };
const AboutYou = () => { new Section('aboutYou', 'Tell me about you', SECTIONS[1].inputs, '/about-your-policy') };
const aboutYourPolicy = () => { new Section('aboutYourPolicy', 'Your Policy', SECTIONS[2].inputs, '/payment') };
const NotFound404 = () => { render(nonFount404(), document.querySelector(this.selector)) } */

//export { NotFound404, AboutYourPet, AboutYou, aboutYourPolicy };
/**
 * @param {String} name
 * @param {String} title
 * @param {Array} inputMeta
 * @param {Function} onFinish
 */
function getSection(name, title, inputMeta, selector, onFinish) {
    return new Section(name, title, inputMeta, selector, onFinish);
}

export default getSection;
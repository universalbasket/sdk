import { html, render } from './lit-html';
import sdk from './sdk';
import serializeForm from './serialize-form';
import nonFount404 from '../templates/not-found-404';
import templates from '../templates/index';

class Section {
    /**
     * @param {String} name
     * @param {String} title
     * @param {Array} inputsMeta
     * @param {String} nextRoute
     */

    constructor(name, title, inputsMeta = [], nextRoute = '/finish') {
        this.name = name;
        this.title = title || name;
        this.inputsMeta = inputsMeta;
        this.nextRoute = nextRoute;

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
        render(templates.section(this.title), document.querySelector('#app'));
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
                        render(html``, document.querySelector('#app'));
                        this.onFinish();
                    }
                })
                .catch(err => {
                    render(html`${err}`, document.querySelector('#error'))
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
        render(html`${template}`, document.querySelector('#target'));
        document.querySelector('.section').scrollIntoView(true);
        this.keysRendered.push(nextKey);
    }

    onFinish() {
        setTimeout(() => { window.location.hash = this.nextRoute }, 1000);
    }
}

const SECTIONS = [
    {
        name: 'aboutYourPet',
        inputs: [
            { key: 'pets', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
        ],
        initial: []
    },
    {
        name: 'aboutYou',
        inputs: [
            { key: 'account', inputMethod: null, sourceOutputKey: null },
            { key: 'owner', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedMaritalStatusOption', inputMethod: "SelectOne",  sourceOutputKey: 'availableMaritalStatusOptions' },/* in-flow, availableMaritalStatusOptions */
            { key: 'selectedAddress', inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses' }
        ],
        initial: ['account', 'owner']
    },
    {
        name: 'aboutYourPolicy',
        inputs: [
            { key: 'policyOptions', inputMethod: null,  sourceOutputKey: null },
            { key: 'selectedCover', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' },
            { key: 'selectedVetPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availableVetPaymentTerms' },
            { key: 'selectedPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availablePaymentTerms' },
            { key: 'selectedCoverType', inputMethod: "SelectOne", sourceOutputKey: 'availableCoverTypes' },
            { key: 'selectedCoverOptions', inputMethod: "SelectMany",  sourceOutputKey: 'availableCoverOptions' },
            { key: 'selectedVoluntaryExcess', inputMethod: 'selectOne', sourceOutputKey: 'availableVoluntaryExcesses' },
            { key: 'selectedVetFee', inputMethod: "SelectOne",  sourceOutputKey: 'availableVetFees' },
        ]
    },
    {
        name: 'payment',
        inputs: [
            { key: 'payment', inputMethod: null, sourceOutputKey: null },
        ]
    }
];

const AboutYourPet = () => { new Section('AboutYourPet', 'Tell me about your pet', SECTIONS[0].inputs, '/about-you') };
const AboutYou = () => { new Section('AboutYou', 'Tell me about you', SECTIONS[1].inputs, '/about-your-policy') };
const aboutYourPolicy = () => { new Section('aboutYourPolicy', 'Your Policy', SECTIONS[2].inputs, null) };
const NotFound404 = () => { render(nonFount404(), document.querySelector('#app')) }

export { NotFound404, AboutYourPet, AboutYou, aboutYourPolicy };

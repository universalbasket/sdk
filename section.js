import { html, render } from './src/lit-html';
import sdk from './src/core';

import kebabCase from 'lodash.kebabcase';
import serializeForm from './src/serialize-form';
import templates from './templates/inputs/index';
import selectOne from './templates/selected-input';


class Section {
    /**
     * @param {String} name
     * @param {String} title
     * @param {Array} inputsMeta
     * @param {function} onFinish
     */
    constructor(name, title, inputsMeta = [], onFinish) {
        this.name = name;
        //this.nameKebabCased = kebabCase(name);
        this.title = title || name;
        this.inputsMeta = inputsMeta;

        this.nonDefaultKeys = this.inputsMeta.filter(im => im.inputMethod).map(nd => nd.key);
        this.renderedKeys = [];
        this.onFinish = onFinish;

        this.init();
    }

    init() {
        this.renderWrapper();
        this.renderDefaultInputs();
    }

    renderWrapper() {
        render(sectionTemplate(this.title), document.querySelector('#app'));
        this.afterRenderWrapper();
    }

    afterRenderWrapper() {
        const form = document.querySelector('form');
        const submitBtn = document.querySelector(`#submitBtn`);

        submitBtn.addEventListener('click', () => {
            // TODO: validate the input (using protocol?)
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
            sdk.createJobInputs(inputs).then(res => {
                if (this.nonDefaultKeys.length !== 0) {
                    this.renderNext();
                    submitBtn.removeAttribute('disabled');
                } else {
                    this.onFinish();
                    submitBtn.removeAttribute('disabled');
                }
            })
        });
    }

    renderDefaultInputs() {
        const defaultKeys = this.inputsMeta.filter(meta => !meta.inputMethod).map(m => m.key);
        const defaultInputsForms = html`${defaultKeys.map(key => templates[key]())}`;

        render(defaultInputsForms, document.querySelector('#target'));
    }

    renderNext() {
        const nextKey = this.nonDefaultKeys.shift();
        const inputMeta = this.inputsMeta.find(im => im.key === nextKey);
        if (!nextKey) {
            return this.onFinish;
        }

        this.currentSection = nextKey;
        render(selectOne(inputMeta), document.querySelector('#target'));
        this.renderedKeys.push(nextKey);
    }
}

function sectionTemplate(title) {
    return html`
<div class="section">
    <h3 class="section__header">${title}</h3>
    <form class="section__body">
        <div id="target"></div>
    </form>

    <button type="button" class="button button--right button--primary" id="submitBtn">Continue</button>
</div>
`;
}

const SECTIONS = [
    {
        name: 'aboutYourPet',
        inputs: [
            { key: 'pets', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
        ]
    },
    {
        name: 'aboutYou',
        inputs: [
            { key: 'account', inputMethod: null, sourceOutputKey: null },
            { key: 'owner', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedMaritalStatusOption', inputMethod: "SelectOne",  sourceOutputKey: 'availableMaritalStatusOptions' },/* in-flow, availableMaritalStatusOptions */
            { key: 'selectedAddress', inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses' }
        ]
    },
    {
        name: 'aboutYourPolicy',
        inputs: [
            { key: 'policyOptions', inputMethod: null,  sourceOutputKey: null }
        ]
    },
    {
        name: 'selectedCover',
        inputs: [
            { key: 'selectedCover', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' }
        ]
    },

    {
        name: 'selectedVetPaymentTerm',
        inputs: [
            { key: 'selectedVetPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' }
        ]
    },
    {
        name: 'selectedPaymentTerm',
        inputs: [
            { key: 'selectedPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' }
        ]
    },
    {
        name: 'payment',
        inputs: [
            { key: 'payment', inputMethod: null, sourceOutputKey: null },
        ]
    }
];

const meta = [
    { key: 'pets', inputMethod: null, sourceOutputKey: null },
    { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
];

const AboutYourPet = (onFinish) => { new Section('AboutYourPet', 'Tell me about your pet', meta, onFinish) } ;
const AboutYou = (onFinish) => { new Section('AboutYou', 'Tell me about you', SECTIONS[1].inputs, onFinish) };

export { AboutYourPet, AboutYou };
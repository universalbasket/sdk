import sdk from './src/sdk';
import router from './router';
import { render } from './src/lit-html';
import * as InputOutput from './src/input-output';

import Summary from './templates/layout/summary';
import Header from './templates/layout/header';
import Footer from './templates/layout/footer';
import Section from './src/sectionRenderer';
import NotFound from './src/NotFound';
import Loading from './templates/loading';


/** TODOS:
 * [v] need to navigate to awaitingInput's page, when waiting for the output
 * []need to assign all the sub-route so that they can navigate directly there
 * [v] gets output from previous-input-output as well
 * CSS - responsive
 * (?) Should we give a flexibility of showing some inputs together?
 */

function createSection(config = {}, selector, callback) {
    //TODO: make config validator
    const { name, title, inputs } = config;

    if (!name) {
        throw new Error('name is needed for section');
    }

    if (!title) {
        throw new Error('title is needed for section');
    }

    if (!Array.isArray(inputs)) {
        throw new Error('inputs needed for section');
    }

    return {
        init: () => {
            sdk
                .create()
                .then(() => Section(name, title, inputs, selector, callback))
                .catch(err => console.log(err));
        }
    };
    }

function createApp(configs = [], selector, callback) {
        //TODO: maybe this core app fetches all domain's meta and store them.
        // config will accept input keys rather than whole meta

    const isValidConfig = configs.length > 0 && configs.every(config => config.name && config.title && config.inputs && config.route);

    if (!isValidConfig) {
        throw new Error('invalid config');
    }

    const flow = configs.map(con => con.route);
    flow.push('/finish');

    const routes = {
        '/': (selector) => Loading(selector),
        '/finish': () => callback(null, 'finish')
    };

    configs.forEach((config, idx) => {
        const { title, inputs, route } = config;
        const next = flow[idx + 1];

        const section = () => Section(name, title, inputs, selector, () => setTimeout(() => { window.location.hash = next }, 1000));
        routes[route] = section;
    })

    const entryPoint = flow[0];

    return {
        init: () => {
            render(Header(), document.querySelector('#header'));
            render(Summary(), document.querySelector('#summary'));
            render(Footer(), document.querySelector('#footer'));

            window.addEventListener('hashchange', () => {
                router(routes, () => NotFound(selector));
                const { inputs, outputs } = InputOutput.getAll();
                render(Summary(inputs, outputs), document.querySelector('#summary'));
            });

            // Listen on page load:
            window.addEventListener('load', () => {
                router(routes, () => NotFound(selector));
                console.log('onload!');
            });

            //
            window.addEventListener('beforeunload', function (e) {
                // Cancel the job
                console.log('unload!');
            });

            //custom event when input submitted
            window.addEventListener('submitinput', () => {
                const { inputs, outputs } = InputOutput.getAll();
                render(Summary(inputs, outputs), document.querySelector('#summary'));
            })

            window.addEventListener('createoutput', () => {
                const { inputs, outputs } = InputOutput.getAll();
                render(Summary(inputs, outputs), document.querySelector('#summary'));
            })

            if (window.location.hash && window.location.hash  !== '/') {
                try {
                    sdk.retrieve();
                    return;
                } catch (err) {
                    console.log('error');
                }
            } else {
                sdk.create()
                    .then(() => { window.location.hash = entryPoint; })
                    .catch(err => console.log(err));
            }
        }
    }
}

export { createSection, createApp };

/* examples for createSection and createApp

const config = {
    name: 'aboutYourPet',
    title: 'Tell Me About Your Pet',
    inputs: [
        { key: 'pets', inputMethod: null, sourceOutputKey: null },
        { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
    ],
};

var section = createSection(config, '#app', () => { console.log('finished!')});

section.init();
*/

const CACHE = [
    {
        name: 'priceBreakdown',
        key: 'priceBreakdown',
        sourceInputKeys: ['selectedOption1', 'selectedOption2']
    }
];

const SECTIONS = [
    {
        name: 'aboutYourPet',
        route: '/about-your-pet',
        title: 'About Your Pet',
        inputs: [
            { key: 'pets', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
        ],
    },
    {
        name: 'aboutYou',
        route: '/about-you',
        title: 'About You',
        inputs: [
            { key: 'account', inputMethod: null, sourceOutputKey: null },
            { key: 'owner', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedAddress', inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses' }
        ]
    },
    {
        name: 'yourPolicy',
        route: '/your-policy',
        title: 'Your Policy',
        inputs: [
            { key: 'policyOptions', inputMethod: null,  sourceOutputKey: null }, //todo: allowCache config for previous
            { key: 'selectedCover', inputMethod: "SelectOne",  sourceOutputKey: 'availableCovers' },
            { key: 'selectedVetPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availableVetPaymentTerms' },
            { key: 'selectedPaymentTerm', inputMethod: "SelectOne",  sourceOutputKey: 'availablePaymentTerms' },
            { key: 'selectedCoverType', inputMethod: "SelectOne", sourceOutputKey: 'availableCoverTypes' },
            { key: 'selectedVoluntaryExcess', inputMethod: 'selectOne', sourceOutputKey: 'availableVoluntaryExcesses' },
            { key: 'selectedCoverOptions', inputMethod: "SelectMany",  sourceOutputKey: 'availableCoverOptions' },
            { key: 'selectedVetFee', inputMethod: "SelectOne",  sourceOutputKey: 'availableVetFees' },
        ]
    },
    {
        name: 'paymentDetail',
        route: '/payment',
        title: 'Payment Details',
        inputs: [
            { key: 'payment', inputMethod: null, sourceOutputKey: null },
            { key: 'directDebit', inputMethod: null, sourceOutputKey: null }
        ]
    },
    {
        name: 'consentPayment',
        route: '/consent-payment',
        title: 'Ready to insure your pet',
        inputs: [
            { key: 'finalPriceConsent', inputMethod: 'Consent', sourceOutputKey: 'finalPrice'},
        ]
    }
];

var app = createApp(SECTIONS, '#app', () => { console.log('finished!')});

app.init();

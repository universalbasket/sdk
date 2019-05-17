import sdk from './src/sdk';
import router from './router';
import { render } from './src/lit-html';

import Summary from './templates/layout/summary';
import Header from './templates/layout/header';
import Footer from './templates/layout/footer';
//import { AboutYourPet, AboutYou, aboutYourPolicy } from './src/sectionRenderer';
import Section from './src/sectionRenderer';
import NotFound from './src/NotFound';

// pet-insurance-specific
/* const routes = {
    '/': () => { sdk.create().then(() => { window.location.hash = '/about-your-pet'; })},
    '/about-your-pet': AboutYourPet,
    '/about-you': AboutYou,
    '/about-your-policy': aboutYourPolicy,
    '/finish': () => { console.log('finished') }
}; */

/** TODOS:
 * need to navigate to awaitingInput's page, when waiting for the output
 * need to assign all the sub-route so that they can navigate directly there
 * gets output from previous-input-output as well
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

    const routes = { '/finish': () => callback(null, 'finish') };

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

            window.addEventListener('hashchange', () => router(routes, () => NotFound(selector)));

            // Listen on page load:
            window.addEventListener('load', () => router(routes));

            //
            window.addEventListener('beforeunload', function (e) {
                // Cancel the job
                console.log('unload!');
            });

            sdk.create()
                .then(() => { window.location.hash = entryPoint; })
                .catch(err => console.log(err));
        }
    }
 }

 //export { createSection, createApp };

/*  const config = {
    name: 'aboutYourPet',
    title: 'Tell Me About Your Pet',
    inputs: [
        { key: 'pets', inputMethod: null, sourceOutputKey: null },
        { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
    ],
};

var section = createSection(config, '#app', () => { console.log('finished!')});

section.init(); */

const SECTIONS = [
    {
        name: 'aboutYourPet',
        route: '/about-your-pet',
        title: 'Tell Me About Your Pet',
        inputs: [
            { key: 'pets', inputMethod: null, sourceOutputKey: null },
            { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
        ],
    },
    {
        name: 'aboutYou',
        route: '/about-you',
        title: 'Tell Me About You',
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
        route: '/about-your-policy',
        title: 'Tell Me About Your Policy',
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
        route: '/payment',
        title: 'Payment Details',
        inputs: [
            { key: 'payment', inputMethod: null, sourceOutputKey: null },
            { key: 'directDebit', inputMethod: null, sourceOutputKey: null }
        ]
    }
];

var app = createApp(SECTIONS, '#app', () => { console.log('finished!')});

app.init();

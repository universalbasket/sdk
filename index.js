import sdk from './src/sdk';
import Router from './router';
import { render } from './src/lit-html';
import * as InputOutput from './src/input-output';
import * as Cache from './src/cache';

import Summary from './templates/layout/summary';
import Header from './templates/layout/header';
import Footer from './templates/layout/footer';
import Section from './src/sectionRenderer';
import NotFound from './src/NotFound';
import Loading from './templates/loading';
import ProgressBar from './src/ProgressBar';

/** TODOS:
 * [v] need to navigate to awaitingInput's page, when waiting for the output
 * []need to assign all the sub-route so that they can navigate directly there
 * [v] gets output from previous-input-output as well
 * CSS - responsive
 * (?) Should we give a flexibility of showing some inputs together?
 */

function createSection(config = {}, selector, callback) {
    //TODO: make config validator
    const { name, title, screens } = config;

    if (!name) {
        throw new Error('name is needed for section');
    }

    if (!title) {
        throw new Error('title is needed for section');
    }

    if (!Array.isArray(screens)) {
        throw new Error('screens needed for section');
    }

    return {
        init: () => {
            sdk
                .create()
                .then(() => Section(name, screens, selector, callback))
                .catch(err => console.log(err));
        }
    };
}

function createApp(SECTION_CONFIGS = [], CACHE_CONFIGS = [], selector, callback) {
        //TODO: maybe this core app fetches all domain's meta and store them.
        // config will accept input keys rather than whole meta

    const isValidConfig = SECTION_CONFIGS.length > 0 && SECTION_CONFIGS.every(config => config.name && config.title && config.screens && config.route);

    if (!isValidConfig) {
        throw new Error('invalid config');
    }

    const flow = SECTION_CONFIGS.map(con => con.route);
    const titles = SECTION_CONFIGS.map(con => con.title);

    flow.push('/finish');

    const routes = {
        '/': (selector) => Loading(selector),
        '/finish': () => callback(null, 'finish')
    };

    SECTION_CONFIGS.forEach((config, idx) => {
        const { title, screens, route } = config;
        const next = flow[idx + 1];

        const render = () => Section(name, screens, selector, () => setTimeout(() => { window.location.hash = next }, 1000));
        routes[route] = { render, title, step: idx + 1 };
    });

    const entryPoint = flow[0];

    return {
        init: () => {
            const router = Router(routes, titles, NotFound(selector), ProgressBar('#progress-bar'))
            render(Header(), document.querySelector('#header'));
            render(Summary(), document.querySelector('#summary'));
            render(Footer(), document.querySelector('#footer'));

            window.addEventListener('hashchange', () => {
                router.navigate();

                const { inputs, outputs } = InputOutput.getAll();
                render(Summary(inputs, outputs), document.querySelector('#summary'));
            });

            // Listen on page load:
            window.addEventListener('load', () => {
                console.info('onload!');

                router.navigate();
            });

            //
            window.addEventListener('beforeunload', function (e) {
                // Cancel the job
                console.info('unload!');
            });

            //custom event when input submitted
            window.addEventListener('submitinput', (e) => {
                //TODO: get cache using output
                Cache.poll(CACHE_CONFIGS, Object.keys(e.detail));
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
                    Cache.pollDefault(CACHE_CONFIGS);
                    return;
                } catch (err) {
                    console.log('error');
                }
            } else {
                sdk.create()
                    .then(() => {
                        window.location.hash = entryPoint;
                        Cache.pollDefault(CACHE_CONFIGS);
                    })
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
        { key: 'pets', waitFor: null },
        { key: 'selectedBreedType', waitFor: 'availableBreedTypes', title: 'select breed type' }
    ],
};

var section = createSection(config, '#app', () => { console.log('finished!')});

section.init();
*/

const CACHE = [
    {
        key: 'priceBreakdown',
        sourceInputKeys: ['selectedOption1', 'selectedOption2']
    },
    {
        key: 'availableCovers',
        sourceInputKeys: []
    },
    {
        key: 'availableVetPaymentTerms',
        sourceInputKeys: ['selectedCover']
    },
    {
        key: 'availablePaymentTerms',
        sourceInputKeys: []
    }
];

const SECTIONS = [
    {
        name: 'aboutYourPet',
        route: '/about-your-pet',
        title: 'About Your Pet',
        screens: [
            { key: 'petsSelectedBreedType', waitFor: 'data.availableBreedTypes' }
        ]
    },
    {
        name: 'aboutYou',
        route: '/about-you',
        title: 'About You',
        screens: [
            { key: 'account', waitFor: null },
            { key: 'owner', waitFor: null },
            { key: 'selectedAddress', waitFor: 'output.availableAddresses' }
        ]
    },
    {
        name: 'yourPolicy',
        route: '/your-policy',
        title: 'Your Policy',
        screens: [
            { key: 'policyOptions', waitFor: null }, //todo: allowCache config for previous
            { key: 'selectedCover', waitFor: 'cache.availableCovers' },
            { key: 'selectedVetPaymentTerm', waitFor: 'output.availableVetPaymentTerms' },
            { key: 'selectedPaymentTerm', waitFor: 'cache.availablePaymentTerms' },
            { key: 'selectedCoverType', waitFor: 'output.availableCoverTypes' },
            { key: 'selectedVoluntaryExcess', waitFor: 'output.availableVoluntaryExcesses' },
            { key: 'selectedCoverOptions', waitFor: 'output.availableCoverOptions' },
            { key: 'selectedVetFee', waitFor: 'output.availableVetFees' }
        ]
    },
    {
        name: 'paymentDetail',
        route: '/payment',
        title: 'Payment Details',
        screens: [
            { key: 'payment', waitFor: 'output.estimatedPrice' },
            { key: 'directDebit', waitFor: 'output.estimatedPrice' }
        ]
    },
    {
        name: 'consentPayment',
        route: '/consent-payment',
        title: 'Ready to insure your pet',
        screens: [
            { key: 'finalPriceConsent', waitFor: 'finalPrice'},
        ]
    }
];

var app = createApp(SECTIONS, CACHE, '#app', () => { console.log('finished!')});

app.init();

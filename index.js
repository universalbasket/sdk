import sdk from './src/sdk';
import Router from './src/router';
import { render } from './src/lit-html';

import * as Storage from './src/input-output';
import * as Cache from './src/cache';

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

function updateSummary(summary = {}) {
    const { template, selector } = summary;
    if (!summary) {
        return;
    }
    const { inputs, outputs, cache } = Storage.getAll();
    render(template(inputs, outputs, cache), document.querySelector(selector));
}

function createApp(SECTION_CONFIGS = [], CACHE_CONFIGS = [], LAYOUT = [], DATA = {}, callback) {
        //TODO: maybe this core app fetches all domain's meta and store them.
        // config will accept input keys rather than whole met

    const isValidConfig = SECTION_CONFIGS.length > 0 && SECTION_CONFIGS.every(config => config.name && config.title && config.screens && config.route);

    if (!isValidConfig) {
        throw new Error('invalid config');
    }

    const { selector: mainSelector } = LAYOUT.find(_ => _.mainTarget == true) || {};

    if (!mainSelector) {
        throw new Error(`main target selector not found in config`);
    }

    const flow = SECTION_CONFIGS.map(con => con.route);
    const titles = SECTION_CONFIGS.map(con => con.title);

    flow.push('/finish');

    const routes = {
        '/': Loading(mainSelector),
        '/finish': () => callback(null, 'finish')
    };

    SECTION_CONFIGS.forEach((config, idx) => {
        const { title, screens, route } = config;
        const next = flow[idx + 1];

        const render = () => Section(name, screens, mainSelector, () => setTimeout(() => { window.location.hash = next }, 1000));
        routes[route] = { render, title, step: idx + 1 };
    });

    const entryPoint = flow[0];

    return {
        init: () => {
            const { initialInputs: input, category, serverUrlPath } = DATA;
            const router = Router(routes, titles, NotFound(mainSelector), ProgressBar('#progress-bar'))

            LAYOUT
                .filter(l => !l.mainTarget)
                .forEach(l => render(l.template(), document.querySelector(l.selector)));

            const Summary = LAYOUT.find(l => l.name === 'summary');

            window.addEventListener('hashchange', () => {
                router.navigate();
                if (!window.location.hash || window.location.hash === '/') {
                    sdk.create({ input, category, serverUrlPath})
                        .then(() => {
                            window.location.hash = entryPoint;
                            Cache.pollDefault(CACHE_CONFIGS);
                        })
                        .catch(err => console.log(err));
                }

                updateSummary(Summary.template);
            });

            // Listen on page load:
            window.addEventListener('load', () => {
                router.navigate();
                updateSummary(Summary.template);
            });

            //custom event when input submitted
            window.addEventListener('submitinput', (e) => {
                //TODO: get cache using output
                Cache.poll(CACHE_CONFIGS, Object.keys(e.detail));
                updateSummary(Summary.template);
            })

            window.addEventListener('createoutput', () => {
                updateSummary(Summary.template);
            })

            if (window.location.hash && window.location.hash !== '/') {
                sdk.retrieve()
                    .then(() => {
                        Cache.pollDefault(CACHE_CONFIGS);
                        console.log('job info retrieved');
                    })
                    .catch(err => {
                        window.location.hash = '';
                    });

            } else {
                sdk.create({ input, category, serverUrlPath})
                    .then(() => {
                        window.location.hash = entryPoint;
                    })
                    .catch(err => console.log(err));
            }
        }
    }
}

export { createApp };

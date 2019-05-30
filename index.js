import sdk from './src/sdk';
import Router from './src/router';
import { render } from './src/lit-html';

import * as Storage from './src/input-output';
import * as Cache from './src/cache';

import PageRenderer from './src/pageRenderer';
import NotFound from './src/NotFound';
import Loading from './templates/loading';
import ProgressBar from './src/ProgressBar';

/** TODOS:
 * [v] need to navigate to awaitingInput's pages, when waiting for the output
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

function createApp({ pages = [], cache = [], layout = [], data = {} }, callback) {
        //TODO: maybe this core app fetches all domain's meta and store them.
        // config will accept input keys rather than whole met

    const isValidConfig = pages.length > 0 && pages.every(config => config.name && config.title && config.sections && config.route);

    if (!isValidConfig) {
        throw new Error('invalid config');
    }

    const { selector: mainSelector } = layout.find(_ => _.mainTarget == true) || {};

    if (!mainSelector) {
        throw new Error(`main target selector not found in config`);
    }

    const flow = pages.map(con => con.route);
    const titles = pages.map(con => con.title);

    flow.push('/finish');

    const routes = {
        '/': Loading(mainSelector),
        '/finish': () => callback(null, 'finish')
    };

    pages.forEach((config, idx) => {
        const { title, sections, route } = config;
        const next = flow[idx + 1];

        const render = () => PageRenderer(name, sections, mainSelector, () => setTimeout(() => { window.location.hash = next }, 1000));
        routes[route] = { render, title, step: idx + 1 };
    });

    const entryPoint = flow[0];

    return {
        init: () => {
            const { initialInputs: input, category, serverUrlPath } = data;
            const router = Router(routes, titles, NotFound(mainSelector), ProgressBar('#progress-bar'))

            layout
                .filter(l => !l.mainTarget)
                .forEach(l => render(l.template(), document.querySelector(l.selector)));

            const Summary = layout.find(l => l.name === 'summary');

            window.addEventListener('hashchange', () => {
                router.navigate();
                if (!window.location.hash || window.location.hash === '/') {
                    sdk.create({ input, category, serverUrlPath})
                        .then(() => {
                            window.location.hash = entryPoint;
                            Cache.pollDefault(cache);
                        })
                        .catch(err => console.log(err));
                }

                updateSummary(Summary);
            });

            // Listen on pages load:
            window.addEventListener('load', () => {
                router.navigate();
                updateSummary(Summary);
            });

            //custom event when input submitted
            window.addEventListener('submitinput', (e) => {
                //TODO: get cache using output
                Cache.poll(cache, Object.keys(e.detail));
                updateSummary(Summary);
            })

            window.addEventListener('createoutput', () => {
                updateSummary(Summary);
            })

            if (window.location.hash && window.location.hash !== '/') {
                sdk.retrieve()
                    .then(() => {
                        Cache.pollDefault(caches);
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

import sdk from './sdk';
import Router from './router';
import { render } from './lit-html';

import * as Storage from './storage';
import * as Cache from './cache';

import PageRenderer from './pageRenderer';
import NotFound from './NotFound';
import Loading from './builtin-template/loading';
import ProgressBar from './builtin-template/ProgressBar';

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

    //setup router
    const flow = pages.map(con => con.route);
    const titles = pages.map(con => con.title);

    flow.push('/confirmation');

    const routes = {
        '/': Loading(mainSelector),
        '/confirmation': () => callback(null, 'finish') // TODO: defined final step
    };

    pages.forEach((config, idx) => {
        const { title, sections, route } = config;
        const next = flow[idx + 1];

        const renderer = PageRenderer(name, sections, mainSelector, () => setTimeout(() => { window.location.hash = next }, 1000));
        routes[route] = { renderer, title, step: idx + 1 };
    });

    const entryPoint = flow[0];

    if (data.local) {
        Object.keys(data.local).forEach(key => Storage.set('local', key, data.local[key]));
    }

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
                            Cache.poll(cache);
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
                console.log(e);
                e.detail.forEach(({ key }) => Cache.poll(cache, key));
                updateSummary(Summary);
            })

            window.addEventListener('createoutput', () => {
                updateSummary(Summary);
            })

            if (window.location.hash && window.location.hash !== '/') {
                sdk.retrieve()
                    .then(() => {
                        Cache.poll(cache);
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

function updateSummary(summary = {}) {
    const { template, selector } = summary;
    if (!summary) {
        return;
    }

    const { inputs, outputs, cache, local } = Storage.getAll();
    render(template(inputs, outputs, cache, local), document.querySelector(selector));
}

export { createApp };

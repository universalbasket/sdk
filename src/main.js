import sdk from './sdk.js';
import Router from './router.js';
import { render } from '/web_modules/lit-html/lit-html.js';

import * as Storage from './storage.js';
import * as Cache from './cache.js';

import PageRenderer from './page-renderer.js';
import NotFound from './render-not-found.js';
import Loading from './builtin-templates/loading.js';
import ProgressBar from './render-progress-bar.js';
import Summary from './render-summary.js';
import Confirmation from './builtin-templates/confirmation.js';
import ErrorTemplate from './builtin-templates/error.js';

function createApp({ pages = [], cache = [], layout = [], data = {} }, callback) {
    const isValidConfig = pages.length > 0 && pages.every(config => config.name && config.title && config.sections && config.route);

    if (!isValidConfig) {
        throw new Error('invalid page config');
    }

    const { selector: mainSelector } = layout.find(_ => _.mainTarget == true) || {};
    if (!mainSelector) {
        throw new Error(`main selector not found in config`);
    }

    //setup router
    const flow = pages.map(page => page.route);
    const titles = pages.map(page => page.title);

    flow.push('/confirmation');

    const routes = {
        '/': Loading(mainSelector),
        '/confirmation': { renderer: Confirmation(mainSelector), title: null, step: null },
        '/error': { renderer: ErrorTemplate(mainSelector), title: null, step: null }
    };

    pages.forEach((config, idx) => {
        const { title, sections, route } = config;
        const nextRoute = flow[idx + 1];

        const renderer = PageRenderer(name, sections, mainSelector, () => setTimeout(() => { window.location.hash = nextRoute }, 500));
        routes[route] = { renderer, title, step: idx + 1 };
    });

    const entryPoint = flow[0];

    return {
        init: () => {
            const { initialInputs: input, category, serverUrlPath } = data;
            const router = Router(routes, titles, NotFound(mainSelector), ProgressBar('#progress-bar'))

            layout
                .filter(l => !l.mainTarget)
                .forEach(l => render(l.template(), document.querySelector(l.selector)));

            const summaryConfig = layout.find(l => l.name === 'summary');
            Summary.init(summaryConfig);

            window.addEventListener('hashchange', () => {
                router.navigate();

                if (!window.location.hash || window.location.hash === '/') {
                    createSdk({ input, category, serverUrlPath });
                }

                Summary.update();
            });

            // Listen on pages load:
            window.addEventListener('load', () => {
                router.navigate();
                Summary.update();
            });

            //custom event when input submitted
            window.addEventListener('submitinput', (e) => {
                //TODO: get cache using output
                //e.detail.forEach(({ key }) => Cache.poll(cache, key));
                Summary.update();
            })

            window.addEventListener('createoutput', () => {
                Summary.update();
            })

            if (window.location.hash && window.location.hash !== '/') {
                sdk.retrieve()
                    .then(() => {
                        afterSdkCreated();
                    })
                    .catch(err => {
                        window.location.hash = '';
                    });

            } else {
                createSdk({ input, category, serverUrlPath });
            }

            function createSdk({ input, category, serverUrlPath }) {
                sdk.create({ input, category, serverUrlPath})
                    .then(() => {
                        window.location.hash = entryPoint;
                        afterSdkCreated();
                    })
                    .catch(err => {
                        console.log(err);
                        window.location.hash = '/error';
                    });
            }

            function afterSdkCreated () {
                if (data.local) {
                    Object.keys(data.local).forEach(key => {
                        Storage.set('local', key, data.local[key]);
                    });
                }

                Cache.poll(cache);

                sdk.trackJob((event) => {
                    if (event === 'fail') {
                        window.location.hash = '/error';
                    }
                })
            }
        },
    }
}

export { createApp };

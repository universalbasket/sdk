import sdk from './sdk.js';
import Router from './router.js';
import { render } from '/web_modules/lit-html/lit-html.js';

import * as Storage from './storage.js';
import * as Cache from './cache.js';

import PageRenderer from './page-renderer.js';
import NotFound from './render-not-found.js';
import Summary from './render-summary.js';

import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import Layout from './layout.js';

import error from './builtin-templates/error.js';
import inlineLoading from './builtin-templates/inline-loading.js';
import loading from './builtin-templates/loading.js';
import modal from './builtin-templates/modal.js';
import notFound404 from './builtin-templates/not-found-404.js';
import pageWrapper from './builtin-templates/page-wrapper.js';
import priceDisplay from './builtin-templates/price-display.js';
import progressBar from './builtin-templates/progress-bar.js';

export const templates = {
    error,
    inlineLoading,
    loading,
    modal,
    notFound404,
    pageWrapper,
    priceDisplay,
    progressBar
};

function validatePages(pages) {
    if (!pages || !pages.length) {
        throw new Error('No pages configured.');
    }

    for (const { name, title, sections, route } of pages) {
        if (typeof name !== 'string') {
            throw new Error('The name of a page was not found.');
        }

        if (typeof title !== 'string') {
            throw new Error(`The title of page ${name} was not found.`);
        }

        if (typeof route !== 'string') {
            throw new Error(`The route of page ${name} was not found.`);
        }

        if (!Array.isArray(sections) || sections.length === 0) {
            throw new Error(`The sections of page ${name} were not found or empty.`);
        }

        for (const { name: sectionName, template } of sections) {
            if (!template) {
                throw new Error(`Template for page ${name} section ${sectionName} not found.`);
            }
        }
    }
}

export function createApp({ pages, cache = [], layout, data = {} }, callback) {
    validatePages(pages);

    const mainSelector = '#main';

    //setup router
    const routingOrder = pages.map(page => page.route);
    const routes = {
        '/': loading(mainSelector),
        '/error': { renderer: error(mainSelector), title: null, step: null }
    };

    pages.forEach((config, stepIndex) => {
        const { title, sections, route, isSuccessPage = false } = config;
        let onFinish = null;
        let step = stepIndex;

        if (isSuccessPage || pages.length === stepIndex + 1) {
            onFinish = callback;
            step = null;
        } else {
            const nextRoute = routingOrder[stepIndex + 1];
            onFinish = () => setTimeout(() => { window.location.hash = nextRoute; }, 500);
        }

        const renderer = PageRenderer(name, sections, mainSelector, onFinish);

        routes[route] = { renderer, title, step };
    });

    const entryPoint = routingOrder[0];
    const router = Router(routes, NotFound(mainSelector));

    return {
        init: () => {
            const { MobileTemplate, DesktopTemplate } = layout['summary'];

            render(Layout(), document.querySelector('#app'));
            render(layout['header'](), document.querySelector('#header'));
            render(layout['footer'](), document.querySelector('#footer'));

            installMediaQueryWatcher('(max-width: 650px)', match => {
                Summary.init(match ? MobileTemplate : DesktopTemplate, match);
            });


            const { initialInputs: input, category, serverUrlPath } = data;

            window.addEventListener('hashchange', () => {
                router.navigate();
                Summary.update();

                const isRoot = !window.location.hash || window.location.hash === '/';
                if (isRoot) {
                    sdk.create({ input, category, serverUrlPath })
                        .then(() => {
                            window.location.hash = entryPoint;
                            afterSdkInitiated(cache, data);
                        })
                        .catch(err => {
                            console.error(err);
                            window.location.hash = '/error';
                        });
                } else {
                }
            });

            //custom event when input submitted
            window.addEventListener('newInputs', e => {
                e.detail && e.detail.forEach(({ key }) => Cache.poll(cache, key));
                Summary.update();
            });

            window.addEventListener('newOutputs', () => {
                Summary.update();
            });

            router.navigate();
            const isRoot = !window.location.hash || window.location.hash === '/';
            if (isRoot) {
                sdk.create({ input, category, serverUrlPath })
                    .then(() => {
                        window.location.hash = entryPoint;
                        afterSdkInitiated(cache, data);
                    })
                    .catch(err => {
                        console.error(err);
                        window.location.hash = '/error';
                    });
            } else {
                sdk.retrieve()
                    .then(() => {
                        afterSdkInitiated(cache, data);
                    })
                    .catch(() => {
                        window.location.hash = '';
                    });
            }
        }
    };
}

function afterSdkInitiated(cacheConfig, data) {
    if (data.local) {
        Object.keys(data.local).forEach(key => {
            Storage.set('local', key, data.local[key]);
        });
    }

    Cache.poll(cacheConfig);
    Summary.update();

    const newOutputsEvent = new CustomEvent('newOutputs');
    let loading = false;

    sdk.trackJob(event => {
        if (event === 'fail') {
            window.location.hash = '/error';
        }

        if (event === 'createOutput' && !loading) {
            loading = true;

            sdk.getJobOutputs()
                .then(outputs => {
                    outputs.data.forEach(output => {
                        Storage.set('output', output.key, output.data);
                    });

                    window.dispatchEvent(newOutputsEvent);
                    loading = false;
                });
        }
    });
}

export async function createInputs(inputs) {
    if (!sdk.initiated) {
        throw new Error('sdk not initiated');
    }
    const submittedInputs = await sdk.createJobInputs(inputs);
    const event = new CustomEvent('newInputs', { detail: submittedInputs });

    window.dispatchEvent(event);
}

export async function cancel() {
    if (!sdk.initiated) {
        throw new Error('sdk not initiated');
    }
    await sdk.cancelJob();
}

import Router from './router.js';
import { render, html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

import * as Storage from './storage.js';
import * as Cache from './cache.js';

import PageRenderer from './page-renderer.js';
import NotFound from './render-not-found.js';
import Summary from './render-summary.js';

import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import Layout from './layout.js';

import error from './builtin-templates/error.js';
import inlineLoading from './builtin-templates/inline-loading.js';
import modal from './builtin-templates/modal.js';
import notFound404 from './builtin-templates/not-found-404.js';
import pageWrapper from './builtin-templates/page-wrapper.js';
import priceDisplay from './builtin-templates/price-display.js';
import priceType from './builtin-templates/price-type.js';
import progressBar from './builtin-templates/progress-bar.js';

export const templates = {
    error,
    inlineLoading,
    modal,
    notFound404,
    pageWrapper,
    priceDisplay,
    priceType,
    progressBar
};

export {
    html,
    render,
    classMap
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

export function createApp({ pages, cache = [], layout, sdk, supportEmail, local }, callback) {
    validatePages(pages);

    const mainSelector = '#main';

    //setup router
    const routingOrder = pages.map(page => page.route);
    const routes = {
        '/error': { renderer: error(mainSelector, supportEmail), title: null, step: null }
    };

    pages.forEach(({ title, sections, route, excludeStep }, stepIndex) => {
        const step = excludeStep ? null : stepIndex;

        let onFinish;

        if (pages.length === stepIndex + 1) {
            onFinish = callback || (() => console.log('App complete.'));
        } else {
            const nextRoute = routingOrder[stepIndex + 1];
            onFinish = () => window.location.hash = nextRoute;
        }

        const renderer = PageRenderer(sdk, sections, mainSelector, onFinish);

        routes[route] = { renderer, title, step };
    });

    const entryPoint = routingOrder[0];
    const router = Router(routes, NotFound(mainSelector));

    render(Layout(), document.querySelector('#app'));
    render(layout.header(), document.querySelector('#header'));
    render(layout.footer(), document.querySelector('#footer'));

    installMediaQueryWatcher('(max-width: 650px)', match => {
        Summary.init(match ? layout.summary.MobileTemplate : layout.summary.DesktopTemplate, match);
    });

    let tracker = null;

    window.addEventListener('hashchange', async () => {
        router.navigate();
        Summary.update();

        if (router.isCurrentRoot()) {
            if (tracker) {
                tracker.stop();
            }

            try {
                const job = await sdk.getJob();
                const otp = await sdk.createOtp();

                Storage.set('_', 'serviceName', job.serviceName);
                Storage.set('_', 'otp', otp);
            } catch (err) {
                console.error(err);
                window.location.hash = '/error';
            }
        }
    });

    //custom event when input submitted
    window.addEventListener('newInputs', e => {
        e.detail && e.detail.forEach(({ key }) => Cache.poll(sdk, cache, key));
        Summary.update();
    });

    window.addEventListener('newOutputs', () => {
        Summary.update();
    });

    router.navigate();

    if (router.isCurrentRoot()) {
        window.location.hash = entryPoint;
    }

    afterSdkInitiated(sdk, cache, local);

    tracker = addTracker(sdk);
}

function afterSdkInitiated(sdk, cacheConfig, local) {
    if (local) {
        for (const [key, val] of Object.entries(local)) {
            Storage.set('local', key, val);
        }
    }

    Cache.poll(sdk, cacheConfig);
    Summary.update();
}

function addTracker(sdk) {
    let loading = false;

    const stop = sdk.trackJob((event, error) => {
        console.log(`event ${event}`);

        switch (event) {
        case 'error':
            return console.error(error);

        case 'fail':
            stop();
            return void (window.location.hash = '/error');

        case 'createOutput':
            if (loading) {
                return;
            }

            loading = true;

            return sdk.getJobOutputs()
                .then(outputs => {
                    for (const { key, data } of outputs.data) {
                        Storage.set('output', key, data);
                    }

                    window.dispatchEvent(new CustomEvent('newOutputs'));
                    loading = false;
                })
                .catch(error => {
                    console.error('Error getting job outputs.', error);
                    loading = false;
                });
        }
    });

    console.info('Job tracker added.');

    return { stop };
}

export async function createInputs(sdk, inputs) {
    const submittedInputs = [];

    for (const [rawKey, rawData] of Object.entries(inputs)) {
        const { key, data } = rawKey === 'pan' ?
            { key: 'panToken', data: await sdk.vaultPan(rawData) } :
            { key: rawKey, data: rawData };

        Storage.set('input', key, data);

        submittedInputs.push({ key, data });
    }

    window.dispatchEvent(new CustomEvent('newInputs', { detail: submittedInputs }));
}

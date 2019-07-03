import Router from './router.js';
import { render, html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import { until } from '/web_modules/lit-html/directives/until.js';

import * as Storage from './storage.js';
import * as Cache from './cache.js';

import PageRenderer from './page-renderer.js';
import NotFound from './render-not-found.js';
import Summary from './render-summary.js';

import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import Layout from './layout.js';

import modal from './builtin-templates/modal.js';
import priceDisplay from './builtin-templates/price-display.js';
import priceType from './builtin-templates/price-type.js';
import progressBar from './builtin-templates/progress-bar.js';
import file from './builtin-templates/file-download.js';
import flashError from './builtin-templates/flash-error.js';
import markup from './builtin-templates/get-markup.js';

export const templates = {
    modal,
    priceDisplay,
    priceType,
    progressBar,
    file,
    markup
};

export {
    html,
    render,
    classMap,
    until
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

export async function createApp({ mountPoint, pages, cache = [], layout, error, sdk, local, input = {} }, callback) {
    validatePages(pages);

    try {
        const [job, otp] = await Promise.all([sdk.getJob(), sdk.createOtp()]);

        Storage.set('_', 'jobId', job.id);
        Storage.set('_', 'serviceName', job.serviceName);
        Storage.set('_', 'otp', otp);
    } catch (err) {
        console.error(err);
        window.location.hash = '/error';
    }

    for (const [key, data] of Object.entries(input)) {
        Storage.set('input', key, data);
    }

    const mainSelector = '#main';

    //setup router
    const routingOrder = pages.map(page => page.route);

    function errorPageRenderer(sdk) {
        return {
            init() {
                render(html`<div class="page"><div class="page__body" id="target">${error(sdk)}</div></div>`, document.querySelector(mainSelector));
            }
        };
    }

    const routes = {
        '/error': { renderer: errorPageRenderer(sdk), title: null, step: null }
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

    mountPoint.innerHTML = Layout();
    render(layout.header(), document.querySelector('#header'));
    render(layout.footer(), document.querySelector('#footer'));

    const summary = new Summary(sdk);

    installMediaQueryWatcher('(max-width: 650px)', match => {
        summary.setTemplate(match ? layout.summary.MobileTemplate : layout.summary.DesktopTemplate, match);
    });

    const tracker = addTracker(sdk);

    window.addEventListener('hashchange', async () => {
        router.navigate();
        summary.update();

        if (router.isCurrentRoot()) {
            if (tracker) {
                tracker.stop();
            }
        }
    });

    //custom event when input submitted
    window.addEventListener('newInputs', e => {
        e.detail && e.detail.forEach(({ key }) => Cache.poll(sdk, cache, key));
        summary.update();
    });

    window.addEventListener('newOutputs', () => {
        summary.update();
    });

    router.navigate();

    if (router.isCurrentRoot()) {
        window.location.hash = entryPoint;
    }

    afterSdkInitiated(sdk, summary, cache, local);
}

function afterSdkInitiated(sdk, summary, cacheConfig, local) {
    if (local) {
        for (const [key, val] of Object.entries(local)) {
            Storage.set('local', key, val);
        }
    }

    Cache.poll(sdk, cacheConfig);
    summary.update();
}

function addTracker(sdk) {
    let loading = false;

    let tdsTimeout;
    async function handle3dsEvent(event) {
        if (event === 'tdsStart') {
            clearTimeout(tdsTimeout);
            let res;

            try {
                res = await sdk.getActiveTds();
            } catch (err) {
                console.warn(err);
                return;
            }

            const iframeContent = modal(html`<iframe src="${res.url}"></iframe>`, { isLocked: true });
            iframeContent.fake();
            tdsTimeout = setTimeout(() => iframeContent.show(), 5000);
        }

        if (event === 'tdsFinish') {
            clearTimeout(tdsTimeout);
            modal().close();
        }
    }

    const stop = sdk.trackJob((event, error) => {
        console.log(`event ${event}`);

        switch (event) {
            case 'tdsStart':
                return handle3dsEvent('tdsStart');

            case 'tdsFinish':
                return handle3dsEvent('tdsFinish');

            case 'close':
                return modal().close();

            case 'error':
                return console.error(error);

            case 'fail':
                stop();
                flashError().hide();
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

        await sdk.createJobInput(key, data);

        Storage.set('input', key, data);

        submittedInputs.push({ key, data });
    }

    window.dispatchEvent(new CustomEvent('newInputs', { detail: submittedInputs }));
}

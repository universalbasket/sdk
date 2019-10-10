import Router from './router.js';

import { set as storageSet } from './storage.js';
import * as Cache from './cache.js';
import * as validation from './validation.js';

import PageRenderer from './page-renderer.js';
import Summary from './render-summary.js';

import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import createLayout from './layout.js';
import InputFields from './input-fields.js';

import modal from './builtin-templates/modal.js';
import priceDisplay from './builtin-templates/price-display.js';
import progressBar from './builtin-templates/progress-bar.js';
import file from './builtin-templates/file-download.js';
import flashError from './builtin-templates/flash-error.js';
import markup from './builtin-templates/get-markup.js';
import hostedPaymentCardForm from './builtin-templates/hosted-payment-card-form.js';

export const templates = {
    modal,
    priceDisplay,
    progressBar,
    file,
    markup,
    hostedPaymentCardForm
};

export async function createApp({ mountPoint, sdk, layout, pages, input = {}, error, notFound, cache = [], local }, callback) {
    if (callback) {
        console.warn('The callback parameter is deprecated. Use the promise that createApp returns.');
    }

    validation.pages(pages);
    validation.cache(cache);

    try {
        const [job, otp] = await Promise.all([sdk.getJob(), sdk.createOtp()]);

        storageSet('_', 'jobId', job.id);
        storageSet('_', 'serviceName', job.serviceName);
        storageSet('_', 'otp', otp);
    } catch (err) {
        window.location.hash = '/error';
        throw err;
    }

    for (const [key, data] of Object.entries(input)) {
        storageSet('input', key, data);
    }

    const { attributes: { inputKeys = [], inputFields, outputKeys = [] } = {} } = await sdk.getService();

    const mainSelector = '.sdk-app-bundle-layout-main';

    //setup router
    const routes = {
        '/error': { renderer: error(mainSelector, sdk), title: null, step: null }
    };

    const renderEssentials = { sdk, cache, selector: mainSelector, inputKeys, outputKeys };

    const pagesDonePromise = new Promise(resolve => {
        pages.forEach(({ title, sections, route, excludeStep }, stepIndex) => {
            const isLastPage = pages.length === stepIndex + 1;
            const onFinish = isLastPage ? resolve : () => location.replace('#' + pages[stepIndex + 1].route);

            routes[route] = {
                title,
                renderer: PageRenderer({
                    ...renderEssentials,
                    sections,
                    onFinish,
                    inputFields: new InputFields(!!inputFields, inputFields)
                }),
                step: excludeStep ? null : stepIndex
            };
        });
    });

    const entryPoint = pages[0].route;
    const router = Router(routes, notFound(mainSelector));

    mountPoint.appendChild(createLayout(layout));

    const summary = new Summary(sdk);

    installMediaQueryWatcher('(max-width: 650px)', match => {
        summary.setTemplate(match ? layout.summary.MobileTemplate : layout.summary.DesktopTemplate, match);
    });

    Cache.populate(sdk, cache)
        .then(() => summary.update());

    const tracker = addTracker(sdk);

    //custom event when input submitted
    window.addEventListener('newInputs', e => {
        e.detail && e.detail.forEach(({ key }) => Cache.populate(sdk, cache, key));
        summary.update();
    });

    window.addEventListener('newOutput', () => {
        summary.update();
    });

    let shouldNavigate = true;

    if (router.isCurrentRoot()) {
        window.location.replace('#' + entryPoint);
        shouldNavigate = false;
    }

    window.addEventListener('hashchange', async () => {
        router.navigate();
        summary.update();

        if (router.isCurrentRoot()) {
            if (tracker) {
                tracker.stop();
            }
        }
    });

    if (shouldNavigate) {
        router.navigate();
    }

    afterSdkInitiated(sdk, summary, cache, local);

    if (callback) {
        pagesDonePromise
            .then(callback)
            .catch(callback);
    }

    return pagesDonePromise;
}

function afterSdkInitiated(sdk, summary, cacheConfig, local) {
    console.info('afterSdkInitiated');
    if (local) {
        for (const [key, val] of Object.entries(local)) {
            storageSet('local', key, val);
        }
    }

    Cache.populate(sdk, cacheConfig);
    summary.update();
}

function addTracker(sdk) {
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

            const iframe = document.createElement('iframe');
            iframe.src = res.url;
            const iframeContent = modal(iframe, { isLocked: true });
            iframeContent.show({ hidden: true });
            tdsTimeout = setTimeout(() => iframeContent.show(), 5000);
        }

        if (event === 'tdsFinish') {
            clearTimeout(tdsTimeout);
            modal().close();
        }
    }

    const stop = sdk.trackJob(async (eventName, jobEvent) => {
        console.log(`event ${eventName}`);

        switch (eventName) {
            case 'tdsStart':
                return handle3dsEvent('tdsStart');

            case 'tdsFinish':
                return handle3dsEvent('tdsFinish');

            case 'close':
                return modal().close();

            case 'error':
                return console.error(jobEvent);

            case 'fail':
                stop();
                flashError().hide();
                return void (window.location.hash = '/error');

            case 'createOutput':
                if (jobEvent.stage) {
                    console.warn('An output was created with a stage. Ignoring.');
                    return;
                }

                try {
                    const output = await sdk.getJobOutput(jobEvent.key);
                    storageSet('output', output.key, output.data);
                    window.dispatchEvent(new CustomEvent('newOutput', { detail: { output } }));
                } catch (error) {
                    console.error('Error getting job outputs.', error);
                }
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

        storageSet('input', key, data);

        submittedInputs.push({ key, data });
    }

    window.dispatchEvent(new CustomEvent('newInputs', { detail: submittedInputs }));
}

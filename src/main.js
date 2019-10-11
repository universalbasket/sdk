import Router from './router.js';

import { set as storageSet } from './storage.js';
import * as Cache from './cache.js';
import * as validation from './validation.js';

import PageRenderer from './page-renderer.js';
import Summary from './render-summary.js';

import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import createLayout from './layout.js';
import InputFields from './input-fields.js';

export async function createApp({ mountPoint, sdk, layout, pages, input = {}, error, notFound, cache = [], local }, callback) {
    validation.pages(pages);
    validation.cache(cache);

    try {
        const [job, otp] = await Promise.all([sdk.getJob(), sdk.createOtp()]);

        storageSet('_', 'jobId', job.id);
        storageSet('_', 'serviceName', job.serviceName);
        storageSet('_', 'otp', otp);
    } catch (err) {
        console.error(err);
        window.location.hash = '/error';
    }

    for (const [key, data] of Object.entries(input)) {
        storageSet('input', key, data);
    }

    const { attributes: { inputKeys = [], inputFields, outputKeys = [] } = {} } = await sdk.getService();

    const mainSelector = '.sdk-app-bundle-layout-main';

    //setup router
    const routingOrder = pages.map(page => page.route);

    const routes = {
        '/error': { renderer: error(mainSelector, sdk), title: null, step: null }
    };

    pages.forEach(({ title, sections, route, excludeStep }, stepIndex) => {
        const step = excludeStep ? null : stepIndex;

        let onFinish;

        if (pages.length === stepIndex + 1) {
            onFinish = callback || (() => console.log('App complete.'));
        } else {
            const nextRoute = routingOrder[stepIndex + 1];
            onFinish = () => window.location.replace('#' + nextRoute);
        }

        const renderer = PageRenderer({
            sdk,
            sections,
            cache,
            selector: mainSelector,
            onFinish,
            inputKeys,
            inputFields: new InputFields(!!inputFields, inputFields),
            outputKeys
        });

        routes[route] = { renderer, title, step };
    });

    const entryPoint = routingOrder[0];
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

    const stop = sdk.trackJob(async (eventName, jobEvent) => {
        console.log(`event ${eventName}`);

        switch (eventName) {

            case 'error':
                return console.error(jobEvent);

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

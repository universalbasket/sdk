import Router from './router.js';
import storage from './storage.js';
import * as Cache from './cache.js';
import SectionController from './section-controller.js';

export async function createApp({ mountPoint, sdk, pages, input = {}, error, notFound, cache = [], local = {} }) {
    // get the automation job that we are using
    try {
        const job = await sdk.getJob();

        storage.set('_', 'job', job);
        storage.set('_', 'jobId', job.id);
        storage.set('_', 'serviceName', job.serviceName);
    } catch (err) {
        window.location.hash = '/error';
        throw err;
    }

    // set storage passed through from backend
    for (const [key, data] of Object.entries(input)) {
        storage.set('input', key, data);
    }

    // set local data pass through from local web app
    for (const [key, val] of Object.entries(local)) {
        storage.set('local', key, val);
    }

    // populate the PJO cache
    await Cache.populate(sdk, cache);

    // get the service details from API
    const service = await sdk.getService();

    //setup routes
    const routes = [];

    const controllerOptions = { sdk, cache, mountPoint, service };

    // add all of the pages to the router
    let index = 0;

    pages.forEach((page, pageIndex) => {
        page.sections.forEach((section, sectionIndex) => {
            const hash = page.name + '/' + section.name;
            routes.push({
                hash,
                index,
                controller: new SectionController({
                    ...controllerOptions,
                    section,
                    page,
                    nextRoute: null
                })
            });

            // maintain a reference to the next route
            if (index > 0) {
                routes[index-1].controller.nextRoute = hash;
            }

            index++;
        });
    });

    // add error route controllers
    routes.push({ hash: 'error', controller: new SectionController({ ...controllerOptions, section: { template: error }}) });
    routes.push({ hash: 'notFound', controller: new SectionController({ ...controllerOptions, section: { template: notFound }}) });

    const router = Router(routes);

    // populate the cache when the sdk starts
    Cache.populate(sdk, cache);

    // track API events
    const tracker = addTracker(sdk);

    // send sdkRefresh message whenever a new input is detected
    window.addEventListener('newInputs', e => {
        // populate any additional cache keys
        e.detail && e.detail.forEach(({ key }) => Cache.populate(sdk, cache, key));
        window.dispatchEvent(new CustomEvent('sdkRefresh', { detail: e }));
    });

    // send sdkRefresh message whenever a new output is detected
    window.addEventListener('newOutput', e => {
        window.dispatchEvent(new CustomEvent('sdkRefresh', { detail: e }));
    });

    // if the hash changes, navigate to the next route
    window.addEventListener('hashchange', async () => {
        router.navigate();
        window.dispatchEvent(new CustomEvent('sdkRefresh'));

        if (router.isCurrentRoot()) {
            if (tracker) {
                tracker.stop();
            }
        }
    });

    // if we're at "/", then navigate to the first page/section hash
    if (router.isCurrentRoot()) {
        return window.location.replace('#' + routes[0].hash);
    }

    // navigate to the current route
    router.navigate();
}

// track events coming from the API (state change, new outputs etc)
function addTracker(sdk) {
    const stop = sdk.trackJob(async (eventName, jobEvent) => {
        console.log(`event ${eventName}`);

        switch (eventName) {
            case 'fail':
                window.location.hash = '#error';
                
                // store the latest job with error message
                const job = await sdk.getJob();
                storage.set('_', 'job', job);

                return console.error(jobEvent);

            case 'error':
                window.location.hash = '#error';
                return console.error(jobEvent);

            case 'createOutput':
                try {
                    // get the new output and store it
                    const output = await sdk.getJobOutput(jobEvent.key);
                    storage.set('output', output.key, output.data);
                    
                    window.dispatchEvent(new CustomEvent('newOutput', { detail: { output } }));
                } catch (error) {
                    console.error('Error getting job outputs.', error);
                }
        }
    });

    console.info('Job tracker added.');

    return { stop };
}
import { createApp } from '/web_modules/@ubio/sdk.js';
import { createEndUserSdk } from '/web_modules/@ubio/client-library.js';
import CONFIG from './ubio.config.js';
import modal from './templates/helpers/modal.js';
import flashError from './templates/helpers/flash-error.js';

export async function createJob(/* will probably take arguments later */) {
    const res = await fetch('/create-job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Put stuff in here later if you need.
    });

    if (!res.ok) {
        throw new Error(`Unexpected response from server ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

let tdsTimeout;

function trackJobEvents(sdk) {
    sdk.trackJob(async eventName/*, jobEvent */ => {
        switch (eventName) {
            case 'tdsStart':
            case 'tdsFinish':
                return handle3dsEvent(sdk, eventName);

            case 'close':
                return modal().close();

            case 'fail':
                stop();
                flashError().hide();
                return void(window.location.hash = '/error');
        }
    });
}

async function handle3dsEvent(sdk, event) {
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
        tdsTimeout = setTimeout(() => iframeContent.show(), 5000); // eslint-disable-line require-atomic-updates
    }

    if (event === 'tdsFinish') {
        clearTimeout(tdsTimeout);
        modal().close();
    }
}

export async function continueJob({ mountPoint, token, jobId, serviceId, input, local }) {
    try {
        const sdk = createEndUserSdk({ token, jobId, serviceId });
        const job = await sdk.getJob();
        trackJobEvents(sdk);

        if (job.finishedAt) {
            console.log('Existing session found for job in end state.');
            localStorage.clear();
            return location.assign('/');
        }

        createApp({ mountPoint, sdk, input, local, ...CONFIG });
    } catch (error) {
        console.error(error);
    }
}

export async function cancelJob({ token, jobId, serviceId }) {
    console.log(`Canceling job: ${jobId}`);

    const sdk = createEndUserSdk({ token, jobId, serviceId });
    const job = await sdk.getJob();
    trackJobEvents(sdk);

    if (job && !job.finishedAt) {
        console.log('Job is active. Canceling.');
        await sdk.cancelJob();
    } else {
        console.log('Job already finished.');
    }

    localStorage.clear();
}

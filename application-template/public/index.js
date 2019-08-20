import { createApp } from '/web_modules/@ubio/sdk.js';
import { createEndUserSdk } from '/web_modules/@ubio/client-library.js';
import CONFIG from './ubio.config.js';

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

export async function runJob({ token, jobId, serviceId, input, local }) {
    try {
        const sdk = createEndUserSdk({ token, jobId, serviceId });

        createApp({ mountPoint: window.app, sdk, input, local, ...CONFIG });
    } catch (error) {
        console.error(error);
    }
}

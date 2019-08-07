import { createApp } from '/web_modules/@ubio/sdk.js';
import { createEndUserSdk } from '/web_modules/@ubio/client-library.js';
import CONFIG from './src/ubio.config.js';

async function createJob() {
    // Make a request to your server to start a job and respond with:
    // { jobId, serviceId, token, input }
}

createJob()
    .then(({ token, jobId, serviceId, input }) => {
        const sdk = createEndUserSdk({ token, jobId, serviceId });

        createApp({ mountPoint: window.app, sdk, input, ...CONFIG });
    })
    .catch(error => console.error(error));

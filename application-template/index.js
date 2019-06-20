import { createApp } from '/web_modules/@ubio/sdk-application-bundle.js';
import { createEndUserSdk } from '/web_modules/@ubio/sdk.js';
import CONFIG from './src/ubio.config.js';

function createJob() {
    // Make a request to your server to start a job and respond with:
    // { jobId, serviceId, token }
}

createJob()
    .then(({ token, jobId, serviceId }) => {
        const sdk = createEndUserSdk({ token, jobId, serviceId });
        const { pages, cache, layout, error } = CONFIG;

        createApp({ mountPoint: window.app, pages, cache, layout, sdk, error });
    })
    .catch(error => console.error(error));

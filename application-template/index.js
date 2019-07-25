import { createApp } from '/web_modules/@ubio/sdk.js';
import { createEndUserSdk } from '/web_modules/@ubio/client-library.js';
import CONFIG from './src/ubio.config.js';

function createJob() {
    // Make a request to your server to start a job and respond with:
    // { jobId, serviceId, token }
}

createJob()
    .then(({ token, jobId, serviceId }) => {
        const sdk = createEndUserSdk({ token, jobId, serviceId });
        const { pages, cache, layout, notFound, error } = CONFIG;

        createApp({ mountPoint: window.app, pages, cache, layout, sdk, notFound, error });
    })
    .catch(error => console.error(error));

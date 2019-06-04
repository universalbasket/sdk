import { createEndUserSdk } from '/web_modules/@ubio/sdk.js';
import * as Storage from './storage.js';

let jobId = localStorage.getItem('jobId') || null;
let token = localStorage.getItem('token') || null;
let serviceId = localStorage.getItem('serviceId') || null;

class EndUserSdk {
    constructor() {
        this.sdk = null;
        this.initiated = false;
    }

    async create({ input = {}, category, serverUrlPath}) {
        if (jobId && token && serviceId) {
            let previous;

            try {
                previous = createEndUserSdk({ token, jobId, serviceId });
                await previous.cancelJob();
            } catch (err) {
                console.log('failed to cancel previous job. it will be abandoned');
            }
        }

        localStorage.clear();

        const newJob = await createJob(input, category, serverUrlPath);

        jobId = newJob.jobId;
        token = newJob.token;
        serviceId = newJob.serviceId;
        localStorage.setItem('jobId', jobId);
        localStorage.setItem('token', token);
        localStorage.setItem('serviceId', serviceId);

        Object.keys(input).forEach(key => Storage.set('input', key, input[key]));

        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
    }

    async retrieve() {
        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
    }

    async createJobInputs(inputs) {
        const pan = Object.keys(inputs).find(key => key === 'pan');

        if (pan) {
            const panToken = await this.sdk.vaultPan(inputs['pan']);
            inputs['panToken'] = panToken;
            delete inputs.pan;
        }

        const keys = Object.keys(inputs);
        const createInputs = keys.map(async key => {
            const data = inputs[key];

            await this.sdk.createJobInput(key, data);
            return { key, data };
        });

        try {
            const submitted = await Promise.all(createInputs);
            submitted.forEach(_ => Storage.set('input', _.key, _.data));
        } catch (err) {
            await this.sdk.resetJob(keys[0]);

            throw err;
        }
    }

    async getCache({ key: outputKey, sourceInputKeys }) {
        const sourceInputs = sourceInputKeys.map(key => { return { key, data: Storage.get('input', key) }});

        const { data: caches = null } = await this.sdk.getPreviousJobOutputs(sourceInputs) || {};

        const cache = caches && caches.find(c => c.key === outputKey) || null;

        return cache ? { key: cache.key, data: cache.data } : null;
    }

    async getDefaultCache(keys = []) {
        const { data: caches = null } = await this.sdk.getPreviousJobOutputs([]) || {};

        return caches
            .filter(cache => keys.includes(cache.key))
            .map(cache => { return { key: cache.key, data: cache.data }});
    }

    trackJobOutput(callback) {
        return this.sdk.trackJob((event, error) => {
            let createdOutputProcessing = false;

            if (event === 'createOutput' && !createdOutputProcessing) {
                createdOutputProcessing = true;
                this.sdk
                    .getJobOutputs()
                    .then(outputs => {
                        outputs.data.forEach(output => {
                            Storage.set('output', output.key, output.data);
                        });

                        callback('outputCreate', null);
                        createdOutputProcessing = false;
                    });
                }
            });
    }

    async submitPan(pan) {
        const panToken = await this.sdk.vaultPan(pan);
        await this.createJobInputs({ panToken });
    }

    async resetJob(fromInputKey, preserveInputs) {
        await this.sdk.resetJob(fromInputKey, preserveInputs);
    }

    trackJob(callback) {
        const stopTracking = this.sdk.trackJob((event, error) => {
            console.log(`event ${event}`);
            console.log(event);

            if (event) {
                callback(event, null);
            }

            if (error) {
                stopTracking();
                callback(null, error);
            }
        });
    }
}

async function createJob(input = {}, category = 'test', SERVER_URL_PATH) {
    SERVER_URL_PATH = SERVER_URL_PATH;
    const res = await fetch(SERVER_URL_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, category }),
        mode: 'cors'
    });

    if (!res.ok) {
        throw new Error(`Unexpected status from server: ${res.status}`);
    }

    return await res.json();
}

const sdk = new EndUserSdk();

export default sdk;

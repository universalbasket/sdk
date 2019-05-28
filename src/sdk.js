import { createEndUserSdk } from '@ubio/sdk';
import { initialInputs } from '../env';
import * as InputOutput from './input-output';

let jobId = localStorage.getItem('jobId') || null;
let token = localStorage.getItem('token') || null;
let serviceId = localStorage.getItem('serviceId') || null;

class EndUserSdk {
    constructor() {
        this.sdk = null;
        this.initiated = false;
    }

    async create(fields = {}) {
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

        const newJob = await createJob(fields);

        jobId = newJob.jobId;
        token = newJob.token;
        serviceId = newJob.serviceId;
        localStorage.setItem('jobId', jobId);
        localStorage.setItem('token', token);
        localStorage.setItem('serviceId', serviceId);

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
            InputOutput.set('input', key, data);
            return { key, data };
        });

        return await Promise.all(createInputs);
    }

    async waitForJobOutput(outputKey, inputKey) {
        const outputs = await this.sdk.getJobOutputs(); // TODO: job
        const output = Array.isArray(outputs.data) && outputs.data.find(ou => ou.key === outputKey);

        if (output) {
            return output.data;
        }

        return await this.trackJobOutput(outputKey);
    }

    async getCache({ key: outputKey, sourceInputKeys }) {
        const sourceInputs = sourceInputKeys.map(key => { return { key, data: InputOutput.get('input', key) }});

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

    trackJobOutput(outputKey) {
        return new Promise((res, rej) => {
            let createdOutputProcessing = false;

            const stopTracking = this.sdk.trackJob((event, error) => {
                if (event === 'createOutput' && !createdOutputProcessing) {
                    createdOutputProcessing = true;
                    this.sdk.getJobOutputs()
                        .then(outputs => {
                            outputs.data.forEach(output => {
                                InputOutput.set('output', output.key, output.data);
                            });

                            createdOutputProcessing = false;
                            const output = outputs.data.find(jo => jo.key === outputKey)

                            if (output) {
                                stopTracking();
                                res(output.data);
                            }

                        });
                }
            });
        });
    }

    async submitPan(pan) {
        const panToken = await this.sdk.vaultPan(pan);
        await this.createJobInputs({ panToken });
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

async function createJob({ input = {}, category = 'test' }) {
    input = { ...initialInputs, ...input };

    const SERVER_URL = "https://ubio-application-bundle-dummy-server.glitch.me";
    const res = await fetch(`${SERVER_URL}/create-job`, {
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

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

    async create({ input = {}, category, serverUrlPath }) {
        localStorage.clear();

        if (jobId && token && serviceId) {
            let previous;

            try {
                previous = createEndUserSdk({ token, jobId, serviceId });
                const job = await previous.getJob();

                if (!['fail', 'success'].includes(job.state)) {
                    await previous.cancelJob();
                }
            } catch (err) {
                console.log('failed to cancel previous job. it will be abandoned');
            }
        }

        const meta = await createJobAndEndUser(input, category, serverUrlPath);

        jobId = meta.jobId;
        token = meta.token;
        serviceId = meta.serviceId;

        localStorage.setItem('jobId', jobId);
        localStorage.setItem('token', token);
        localStorage.setItem('serviceId', serviceId);


        Object.keys(input).forEach(key => Storage.set('input', key, input[key]));

        await this.retrieve();
    }

    async retrieve() {
        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;

        const job = await this.sdk.getJob();
        const otp = await this.sdk.createOtp();

        Storage.set('_', 'serviceName', job.serviceName);
        Storage.set('_', 'otp', otp);
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
            Storage.set('input', key, data);
            return { key, data };
        });

        return await Promise.all(createInputs);
    }

    async getCache({ key: outputKey, sourceInputKeys }) {
        const sourceInputs = sourceInputKeys.map(key => ({ key, data: Storage.get('input', key) }));

        const { data: cacheData = null } = await this.sdk.getPreviousJobOutputs(sourceInputs) || {};

        const cache = cacheData && cacheData.find(c => c.key === outputKey) || null;

        return cache ? { key: cache.key, data: cache.data } : null;
    }

    async getDefaultCache(keys = []) {
        const { data: cacheData = null } = await this.sdk.getPreviousJobOutputs([]) || {};

        return cacheData
            .filter(cache => keys.includes(cache.key))
            .map(cache => ({ key: cache.key, data: cache.data }));
    }

    async getJobOutputs() {
        return await this.sdk.getJobOutputs();
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

            if (event) {
                callback(event, null);
            }

            if (error) {
                stopTracking();
                callback(null, error);
            }
        });

        return stopTracking;
    }

    async cancelJob() {
        await this.sdk.cancelJob();
    }
}

async function createJobAndEndUser(input = {}, category = 'test', SERVER_URL_PATH) {
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

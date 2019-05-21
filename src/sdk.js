import { createEndUserSdk } from '../node_modules/@ubio/sdk/index';
import { initialInputs } from '../env';
import * as submittedInput from './submitted-input';

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
            submittedInput.set(key, data);
        });

        await Promise.all(createInputs);

        return inputs;
    }

    async waitForJobOutput(outputKey, inputKey) {
        const outputs = await this.sdk.getJobOutputs();
        const output = Array.isArray(outputs.data) && outputs.data.find(ou => ou.key === outputKey);

        if (output) {
            return output.data;
        }
        const inputs = submittedInput.getAll();

        const previousOutputs = await this.sdk.getPreviousJobOuputs(submittedInput.objectToArray(inputs)) || [];
        const previous = Array.isArray(previousOutputs.data) && previousOutputs.data.find(ou => ou.key === outputKey);

        if (previous) {
            return previous.data;
        }

        return await this.trackJobOutput(outputKey, inputKey);
    }

    trackJobOutput(outputKey, inputKey) {
        return new Promise((res, rej) => {
            let awaitingInputProcessing = false;
            let createdOutputProcessing = false;

            const stopTracking = this.sdk.trackJob((event, error) => {
                console.log(`event ${event}`);
                console.log(event);

                if (event === 'createOutput' && !createdOutputProcessing) {
                    createdOutputProcessing = true;
                    this.sdk.getJobOutputs()
                        .then(outputs => {
                            const output = outputs.data.find(jo => jo.key === outputKey)

                            if (output) {
                                stopTracking();
                                res(output.data);
                            }

                            createdOutputProcessing = false;
                        });
                }

                if (event === 'awaitingInput' && !awaitingInputProcessing) {
                    awaitingInputProcessing = true;
                    this.sdk.getJob()
                        .then(job => {
                            const { state, awaitingInputKey } = job;
                            if (state === 'awaitingInput' && awaitingInputKey !== inputKey) {
                                const error = {
                                    name: 'jobExpectsDifferentInputKey',
                                    details: { state, awaitingInputKey }
                                };

                                stopTracking();
                                rej(error);
                            }
                            awaitingInputProcessing = false;
                        })
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

    async getPreviousOutputs() {
        const inputs = submittedInput.getAll();
        return await this.sdk.getPreviousJobOuputs(inputs);
    }

    async getPreviousOutput(outputKey) {
        const inputs = submittedInput.getAll();
        const outputs = await this.sdk.getPreviousJobOuputs(inputs);

        return outputs.find(output => output.key = outputKey);
    }
}

async function createJob({ input = {}, category = 'test' }) {
    input = { ...initialInputs, ...input };

    //const job = await endUserSdk.createJob({ serviceId, input, category });
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

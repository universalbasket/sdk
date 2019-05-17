import { createEndUserSdk } from '@ubio/sdk';
import { initialInputs } from '../env';

let jobId = localStorage.getItem('jobId') || null;
let token = localStorage.getItem('token') || null;
let serviceId = localStorage.getItem('serviceId') || null;
let submittedInputs = [];

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

    retrieve() {
        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
        submittedInputs = getAllJobInputs();
    }


    async createJobInputs(inputs) {
        const keys = Object.keys(inputs);
        const createInputs = keys.map(async key => {
            const data = inputs[key];

            await this.sdk.createJobInput(key, data);
            saveJobInput(key, data);
        });

        await Promise.all(createInputs);
    }

    async waitForJobOutput(outputKey, inputKey) {
        const outputs = await this.sdk.getJobOutputs();
        const output = Array.isArray(outputs.data) && outputs.data.find(ou => ou.key === outputKey);

        if (output) {
            return output;
        }

        const previousOutputs = await this.sdk.getPreviousJobOuputs(getAllJobInputs()) || [];
        const previous = Array.isArray(previousOutputs.data) && previousOutputs.data.find(ou => ou.key === outputKey);

        if (previous) {
            return previous;
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
        const inputs = getAllJobInputs();
        return await this.sdk.getPreviousJobOuputs(inputs);
    }

    async getPreviousOutput(outputKey) {
        const inputs = getAllJobInputs();
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


function saveJobInput(key, data) {
    localStorage.setItem(`input.${key}`, JSON.stringify(data));
}

function getAllJobInputs() {
    const length = localStorage.length;
    const inputs = [];

    for (let i = 0; i < length ; i +=1) {
        const key = localStorage.key(i);
        if (key.startsWith('input.')) {
            const trimmed = key.replace('input.', '');
            const data = JSON.parse(localStorage.getItem(key));
            inputs.push({ key: trimmed, data });
        }
    }

    return inputs;
}

const sdk = new EndUserSdk();

export default sdk;

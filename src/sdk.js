import { createEndUserSdk } from '@ubio/sdk';
import { initialInputs } from '../env';
let jobId = localStorage.getItem('jobId') || null;
let token = localStorage.getItem('token') || null;
let serviceId = localStorage.getItem('serviceId') || null;

class EndUserSdk {
    constructor() {
        this.sdk = null;
        this.initiated = false;
    }

    async create(fields = {}) {
        const { token, jobId: currentJobId, serviceId } = await createJob(fields);

        jobId = currentJobId;
        localStorage.setItem('jobId', jobId);
        localStorage.setItem('token', token);
        localStorage.setItem('serviceId', serviceId);

        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
    }

    retrieve() {
        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
    }

    async createJobInputs(inputs) {
        const keys = Object.keys(inputs);
        const createInputs = keys.map(key => {
            const data = inputs[key];
            saveJobInput(key, data);
            return this.sdk.createJobInput(key, data);
        });

        await Promise.all(createInputs);
    }

    waitForJobOutput(outputKey, callback) {
        const stopTracking = this.sdk.trackJob((event, error) => {
            console.log(`event ${event}`);
            console.log(event);

            if (event === 'createOutput') {
                this.sdk.getJobOutputs()
                    .then(outputs => { return outputs.data.find(jo => jo.key === outputKey) })
                    .then(output => {
                        if (output) {
                            stopTracking();
                            callback(null, output);
                        }
                    });
            }
        });
    }

    async submitPan(pan) {
        const panToken = await this.sdk.vaultPan(pan);
        await this.createJobInputs({ panToken });
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

const sdk = new EndUserSdk();

export default sdk;

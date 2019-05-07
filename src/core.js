import { createEndUserSdk } from '@ubio/sdk';

let jobId = null;
let token = null;
let serviceId = null;

class EndUserSdk {
    constructor() {
        this.sdk = null;
        this.initiated = false;
    }

    async create(fields = {}) {
        this.sdk = await createJob(fields);
        this.initiated = true;
    }

    async retrieve() {
        this.sdk = createEndUserSdk({ token, jobId, serviceId });
        this.initiated = true;
    }

    createJobInputs(inputs) {
        const keys = Object.keys(inputs);
        keys.forEach(key => {
            const data = inputs[key];
            this.sdk.createJobInput(key, data)
                .then(() => {
                    saveJobInput(key, data);
                })
                .catch(err => console.error(err));
        });
    }

    waitForJobOutput(outputKey, callback) {
        const stopTracking = this.sdk.trackJob((event, error) => {
            console.log(`event ${name}`);
            console.log(event.name);

            if (event.name === 'createOutput') {
                this.sdk.getJobOutputs(jobId)
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
}

async function createJob({ input = {}, category = 'test' }) {
    const url = 'https://pet.morethan.com/h5/pet/step-1?path=%2FquoteAndBuy.do%3Fe%3De1s1%26curPage%3DcaptureDetails';
    input = { url, ...input };

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

    const { token, jobId: currentJobId, serviceId } = await res.json();

    jobId = currentJobId;
    localStorage.setItem('jobId', jobId);
    localStorage.setItem('token', token);
    localStorage.setItem('serviceId', serviceId);

    return createEndUserSdk({ token, jobId, serviceId });
}


function saveJobInput(key, data) {
    localStorage.setItem(`input.${key}`, JSON.stringify(data));
}

const sdk = new EndUserSdk();

export default sdk;

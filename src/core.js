import { createClientSdk } from '../node_modules/@ubio/sdk/index.js';

const fetch = require('node-fetch');
const token = '4d12fff53abf56507b8ff2c12b51db2cda3fb59875bc8211';
const serviceId = 'c381b16b-3599-4749-839a-269e76b3235c';
const clientSdk = createClientSdk({ fetch, token });

let jobId = localStorage.getItem('jobId') || null;

export default {
    createJob,
    createJobInput,
    waitForJobOutput
}

async function createJob({ input, category = 'test' }) {
    const url = 'https://pet.morethan.com/h5/pet/step-1?path=%2FquoteAndBuy.do%3Fe%3De1s1%26curPage%3DcaptureDetails';
    input = { url, ...input };

    const job = await clientSdk.createJob({ serviceId, input, category });

    /*
    if there was another job then cancel it
    or
    start from where it was!(?)
    */
    if (jobId) {
        clientSdk.cancelJob(jobId).then(res => console.log(res)).catch(e => console.error(e));
    }

    jobId = job.id;
    localStorage.setItem('jobId', job.id);
}

async function waitForJobOutput(key, callback) {
    return await clientSdk.trackJob(jobId, (event) => {
        if (event.name !== 'createOutput') {
            return;
        }

        clientSdk.getJob(jobId)
            .then(job => {
                const output = job.outputs.find(jo => jo.key === key);
                if (!output) {
                    throw new Error('OutputNotAvailable');
                }

                // RecordNotFoundError
                //return getJobOutput(key);
                return;
            })
            .then(output => {
                //callback([output]);
                callback(['small', 'medium']); //test
            })
            .catch(e => console.log(e));

    });
}


async function createJobInput(input) {
    const [key] = Object.keys(input);
    const data = input[key];

    return await clientSdk.createJobInput(jobId, key, data);
}

async function getJobOutput(key) {
    const outputs = await clientSdk.getJobOutputs(jobId, key);
    let latest = outputs.shift();

    return latest || null;
}

async function getPreviousJobOutput(jobId, input) {
    // TODO: need to store inputs history and use it for preciousJotOutput
    const outputs = await clientSdk.getPreviousJobOutputs(jobId, [input]); //only one input for now
    let latest = outputs.shift();

    return latest || null;
}
import { createClientSdk } from '../node_modules/@ubio/sdk/index.js';

const fetch = require('node-fetch');
const token = '4d12fff53abf56507b8ff2c12b51db2cda3fb59875bc8211';
const serviceId = 'c381b16b-3599-4749-839a-269e76b3235c';
const clientSdk = createClientSdk({ fetch, token });

let jobId = localStorage.getItem('jobId') || null;

export default {
    createJob,
    createJobInputs,
    waitForJobOutput
}

async function createJob({ input = {}, category = 'test' }) {
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

function waitForJobOutput(outputKey, callback) {
    /*
        1. Get Job and fnd given outputKey from job.outputs
         -> get output
        2. If not available, trackJob until it does CreateOutputEvent
        3. repeat 1-2 until the key exist.
    */

    awaitingJobOutput()
        .then(() => clientSdk.getJobOutputs(jobId, outputKey))
        .then(output => callback(null, output))
        .catch(err => {
            console.error(err);
            return callback(err, null);
        });



    function awaitingJobOutput() {
        let exist = false;

        return new Promise(resolve => {
            function repeat() {
                jobOutputExists(outputKey)
                    .then(res => exist = res)
                    .then(() => {
                        if (!exist) {
                            return awaitingCreateOutputEvent();
                        }
                    })
                    .then(res => {
                        if (!exist) {
                            return repeat();
                        }
                        return resolve();
                    });
            }

            repeat();
        })

    }

    async function jobOutputExists(outputKey) {
        const job = await clientSdk.getJob(jobId);
        const output =job.outputs.find(jo => jo.key === outputKey);

        return Boolean(output);
    }
}

function awaitingCreateOutputEvent() {
    return new Promise(resolve => {
        const stopTracking = clientSdk.trackJob(jobId, (event) => {
            console.log(`event ${event.name}!`);
            if (event.name === 'createOutput') {
                stopTracking();
                resolve();
            }
        });
    });
}

async function createJobInputs(inputs) {
    const keys = Object.keys(inputs);
    keys.forEach(key => {
        const data = inputs[key];
        clientSdk.createJobInput(jobId, data, key).then(() => {}).catch(err => console.error(err));
    });
}

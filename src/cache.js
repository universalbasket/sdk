import * as Storage from './storage.js';

const fetchingKeys = new Set(); // Ensure that requests for a particular key aren't duplicated.

function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function inputsSatisfied(sourceInputKeys, inputs) {
    return sourceInputKeys.every(key => has(inputs, key));
}

async function getAndCachePreviousOutput(sdk, sourceInputs, outputKey) {
    try {
        console.log('Fetching previous job outputs for:', outputKey);

        fetchingKeys.add(outputKey);

        const result = await sdk.getPreviousJobOutputs(sourceInputs, outputKey);
        const cache = result.data && result.data[0];

        if (cache) {
            Storage.set('cache', cache.key, cache.data);
        }
    } catch (error) {
        console.error('Failed to fetch previous output:', error.stack || error.message);
    } finally {
        fetchingKeys.delete(outputKey);
    }
}

export async function populate(sdk, CACHE_CONFIG) {
    const { inputs, cache } = Storage.getAll();
    const promises = [];

    for (const { key: outputKey, sourceInputKeys } of CACHE_CONFIG) {
        if (!has(cache, outputKey) && !fetchingKeys.has(outputKey) && inputsSatisfied(sourceInputKeys, inputs)) {
            const sourceInputs = sourceInputKeys.map(key => ({ key, data: inputs[key] }));

            promises.push(getAndCachePreviousOutput(sdk, sourceInputs, outputKey));
        }
    }

    await Promise.all(promises);
}

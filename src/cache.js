import { set as storageSet, getAll as storageGetAll } from './storage.js';
import has from './has.js';

const fetchingKeys = new Set(); // Ensure that requests for a particular key aren't duplicated.

function inputsSatisfied(sourceInputKeys, inputs) {
    return sourceInputKeys.every(key => has(inputs, key));
}

async function getAndCachePreviousOutput(sdk, sourceInputs, outputKey) {
    try {
        console.log('Fetching previous job outputs for:', outputKey);

        fetchingKeys.add(outputKey);

        const result = await sdk.getPreviousJobOutputs(sourceInputs, outputKey);
        const cache = result.data && result.data[0];

        console.log('got cache data')

        if (cache) {
            storageSet('cache', cache.key, cache);
            console.log('set storage')
        }
    } catch (error) {
        console.error('Failed to fetch previous output:', error.stack || error.message);
    } finally {
        fetchingKeys.delete(outputKey);
    }
}

export async function populate(sdk, CACHE_CONFIG) {
    const { input, cache } = storageGetAll();
    const promises = [];

    for (const { key: outputKey, sourceInputKeys } of CACHE_CONFIG) {
        if (!has(cache, outputKey) && !fetchingKeys.has(outputKey) && inputsSatisfied(sourceInputKeys, input)) {
            const sourceInputs = sourceInputKeys.map(key => ({ key, data: input[key] }));

            promises.push(getAndCachePreviousOutput(sdk, sourceInputs, outputKey));
        }
    }

    await Promise.all(promises);
}

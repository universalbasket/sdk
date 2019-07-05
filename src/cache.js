import * as Storage from './storage.js';

const fetchingKeys = new Set(); // Ensure that requests for a particular key aren't duplicated.

function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export async function populate(sdk, CACHE_CONFIG) {
    const { inputs, cache } = Storage.getAll();

    for (const { key: outputKey, sourceInputKeys } of CACHE_CONFIG) {
        if (!has(cache, outputKey) && !fetchingKeys.has(outputKey) && sourceInputKeys.every(key => has(inputs, key))) {
            try {
                console.log('Fetching previous job outputs for:', outputKey);

                const sourceInputs = sourceInputKeys.map(key => ({ key, data: Storage.get('input', key) }));

                fetchingKeys.add(outputKey);

                const result = await sdk.getPreviousJobOutputs(sourceInputs, outputKey);

                fetchingKeys.delete(outputKey);

                const cache = result.data && result.data[0];

                if (cache) {
                    Storage.set('cache', cache.key, cache.data);
                }
            } catch (error) {
                fetchingKeys.delete(outputKey);
                console.error('failed to fetch cache', error);
            }
        }
    }
}

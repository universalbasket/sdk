import * as Storage from './storage.js';

export function poll(sdk, CACHE_CONFIG, newInputKey) {
    if (!newInputKey) {
        pollDefault(sdk, CACHE_CONFIG);
    }

    const { inputs } = Storage.getAll();
    CACHE_CONFIG.forEach(config => {
        if (config.sourceInputKeys.includes[newInputKey]) {
            const readyToFetch = config.sourceInputKeys.every(input => inputs[input]);
            if (readyToFetch) {
                fetchAndSave(sdk, config);
            }
        }
    });
}

async function pollDefault(sdk, CACHE_CONFIG) {
    const DEFAULT_KEYS = CACHE_CONFIG.filter(config => config.sourceInputKeys.length === 0).map(config => config.key);

    try {
        const previousJobOutputs = await sdk.getPreviousJobOutputs();
        const previousJobOutputsData = previousJobOutputs && previousJobOutputs.data || [];

        for (const { key, data } of previousJobOutputsData) {
            if (DEFAULT_KEYS.includes(key)) {
                Storage.set('cache', key, data);
            }
        }
    } catch (error) {
        console.error('failed to fetch default cache', error);
    }
}


async function fetchAndSave(sdk, { key: outputKey, sourceInputKeys }) {
    try {
        const sourceInputs = sourceInputKeys.map(key => ({ key, data: Storage.get('input', key) }));
        const { data: cacheData = null } = await sdk.getPreviousJobOutputs(sourceInputs) || {};
        const cache = cacheData && cacheData.find(c => c.key === outputKey) || null;

        if (cache) {
            Storage.set('cache', cache.key, cache.data);
        }
    } catch (err) {
        console.error('failed to fetch cache', err);
    }
}

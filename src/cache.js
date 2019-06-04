import sdk from './sdk.js';
import * as Storage from './storage.js';

export {
    poll
};

function poll(CACHE_CONFIG, newInputKey) {
    if (!newInputKey) {
        pollDefault(CACHE_CONFIG);
    }

    const { inputs } = Storage.getAll();
    CACHE_CONFIG.forEach(config => {
        if (config.sourceInputKeys.includes[newInputKey]) {
            const readyToFetch = config.sourceInputKeys.every(input => inputs[input]);
            if (readyToFetch) {
                fetchAndSave(config);
            }
        }
    });
}

function pollDefault(CACHE_CONFIG) {
    const DEFAULT_KEYS = CACHE_CONFIG.filter(config => config.sourceInputKeys.length === 0).map(config => config.key);

    sdk.getDefaultCache(DEFAULT_KEYS)
        .then(caches => {
            console.log('caches', caches);
            caches.map(cache => Storage.set('cache', cache.key, cache.data));
        })
        .catch(err => console.error('failed to fetch default caches', err))
}


function fetchAndSave(config) {
    sdk.getCache(config)
        .then(cache => {
            if (cache) {
                Storage.set('cache', cache.key, cache.data);
            }
        })
        .catch(err => console.error('failed to fetch cache', err));
}

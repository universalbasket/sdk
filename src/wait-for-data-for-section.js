import { get as storageGet, getWithMeta } from './storage.js';
import has from './has.js';

/**
 * @param {string[]} waitFor
 */
export default async function waitForDataForSection(waitFor, cache) {
    const keysToWaitFor = [];

    for (const typeAndKey of waitFor || []) {
        const [type, key] = typeAndKey.split('.');

        if (type !== 'output' || outputAvailable(key)) {
            continue;
        }

        const matchingCacheSpec = cache.find(c => c.key === key);

        if (matchingCacheSpec) {
            const variability = has(matchingCacheSpec, 'variabilityThreshold') ? matchingCacheSpec.variabilityThreshold : 1;

            if (cacheAvailable(key, variability)) {
                continue;
            }
        }

        keysToWaitFor.push(key);
    }

    await waitForRemainingOutputs(keysToWaitFor);
}

async function waitForRemainingOutputs(keys) {
    if (keys.length === 0) {
        return;
    }

    await new Promise(resolve => {
        window.addEventListener('newOutput', trackOutput);

        function trackOutput() {
            if (keys.every(outputAvailable)) {
                window.removeEventListener('newOutput', trackOutput);
                resolve();
            }
        }
    });
}

function outputAvailable(key) {
    return storageGet('output', key) !== undefined;
}

function cacheAvailable(key, variability) {
    const cache = getWithMeta('cache', key);

    if (!cache) {
        return false;
    }

    return cache.variability <= variability;
}

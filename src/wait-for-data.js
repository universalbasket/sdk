import { get as storageGet, getWithMeta } from './storage.js';
import has from './has.js';

/**
 * @param {string[]} waitFor
 */
export async function waitForData(waitFor, cache) {
    if (waitFor && waitFor.length > 0) {
        await sleep(100);
    }

    const keysToWaitFor = checkForExistingKeys(waitFor, cache);
    await waitForRemainingOutputs(keysToWaitFor);
}

export function checkForExistingKeys(waitFor, cache) {
    const keysToWaitFor = [];

    for (const typeAndKey of waitFor || []) {
        const [type, key] = typeAndKey.split('.');

        if (outputAvailable(key)) {
            continue;
        }

        console.log('waiting for', type, key);

        const matchingCacheSpec = cache.find(c => c.key === key);

        if (matchingCacheSpec) {
            const variability = has(matchingCacheSpec, 'variabilityThreshold') ? matchingCacheSpec.variabilityThreshold : 1;

            if (cacheAvailable(key, variability)) {
                continue;
            }
        }

        if (type === 'output' || type === 'cache') {
            keysToWaitFor.push(key);
        }
    }

    return keysToWaitFor;
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

export async function waitForAwaitingInput(waitFor) {
    // find the waitingInput key
    const key = waitFor.find(k => k.split('.')[0] === 'awaitingInput');

    // if there is no key, return true to continue
    if (!key) {
        return true;
    }

    await new Promise(resolve => {
        window.addEventListener('awaitingInput', trackAwaitingInput);

        function trackAwaitingInput(event) {
            window.removeEventListener('awaitingInput', trackAwaitingInput);
            const result = key.split('.')[1] === event.detail.key;
            resolve(result);
        }
    });
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function outputAvailable(key) {
    return storageGet('output', key) !== undefined;
}

function cacheAvailable(key, variability) {
    const cache = getWithMeta('cache', key);

    console.log('get cache', key, variability, cache);

    if (!cache) {
        return false;
    }

    return cache.data.variability <= variability;
}

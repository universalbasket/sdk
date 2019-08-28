import { get as storageGet } from './storage.js';

/**
 * @param {string[]} waitFor
 */
export default async function waitForDataForSection(waitFor) {
    const keysToWaitFor = [];

    for (const typeAndKey of waitFor || []) {
        const [type, key] = typeAndKey.split('.');

        if (type === 'output' && !outputAvailable(key)) {
            keysToWaitFor.push(key);
        }
    }

    if (keysToWaitFor.length === 0) {
        return;
    }

    await new Promise(resolve => {
        window.addEventListener('newOutput', trackOutput);

        function trackOutput() {
            if (keysToWaitFor.every(outputAvailable)) {
                window.removeEventListener('newOutput', trackOutput);
                resolve();
            }
        }
    });
}

function outputAvailable(key) {
    return storageGet('output', key) !== undefined;
}

import getData from './get-data-with-priority.js';
import * as Storage from './storage.js';

export default async function getDataForSection(waitFor) {
    if (!waitFor || waitFor.length === 0) {
        return {};
    }

    const collection = {};
    const notReady = [];

    for (const typeAndKey of waitFor) {
        const [type, sourceKey] = typeAndKey.split('.');

        if (type === 'input') {
            collection[sourceKey] = Storage.get('input', sourceKey);
            continue;
        }

        const data = getData(type, sourceKey);

        if (data === null || data) { // data is explicitly null
            collection[sourceKey] = data;
            continue;
        }

        notReady.push(sourceKey);
    }

    if (notReady.length === 0) {
        return collection;
    }

    await waitForOutputs(notReady);

    return getDataForSection(waitFor);
}

function waitForOutputs(keysToWaitFor) {
    return new Promise(resolve => {
        window.addEventListener('newOutput', trackOutput);

        function trackOutput() {
            const { outputs } = Storage.getAll();
            const allAvailable = keysToWaitFor.every(k => outputs[k] !== undefined);

            if (allAvailable) {
                window.removeEventListener('newOutput', trackOutput);
                resolve();
            }
        }
    });
}

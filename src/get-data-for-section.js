import getData from './get-data-with-priority.js';
import * as Storage from './storage.js';

export default async function getDataForSection(waitFor = []) {
    if (!waitFor || waitFor.length === 0) {
        return {};
    }

    const results = waitFor.map(_ => {
        const [type, sourceKey] = _.split('.');
        if (type === 'input') {
            const data = Storage.get('input', sourceKey);
            return { data, wait: false, sourceKey };
        }

        const data = getData(type, sourceKey);
        if (data === null || data) { // data is explicitly null
            return { data, wait: false, sourceKey };
        }

        return { data, wait: true, sourceKey };
    });

    const keysToWaitFor = results.filter(r => r.wait === true).map(r => r.sourceKey);

    if (keysToWaitFor.length === 0) {
        const dataWaitFor = {};
        results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

        return dataWaitFor;
    }

    const dataWaitFor = {};
    results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

    const data = await waitForOutputs(keysToWaitFor);

    return { ...dataWaitFor, ...data };
}

function waitForOutputs(keysToWaitFor) {
    return new Promise(resolve => {
        window.addEventListener('newOutputs', trackOutput);

        function trackOutput() {
            const { outputs } = Storage.getAll();
            const allAvailable = keysToWaitFor.every(k => outputs[k] !== undefined);

            if (allAvailable) {
                const data = {};
                keysToWaitFor.forEach(k => data[k] = outputs[k]);

                window.removeEventListener('newOutputs', trackOutput);
                resolve(data);
            }
        }
    });
}

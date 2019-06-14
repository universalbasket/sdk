import getData from './get-data-with-priority.js';
import * as Storage from './storage.js';

export default function getDataForSection(waitFor = []) {
    if (!waitFor || waitFor.length === 0) {
        return Promise.resolve({});
    }

    return new Promise(res => {
        const results = waitFor.map(_ => {
            const [type, sourceKey] = _.split('.');
            if (type === 'input') {
                const data = Storage.get('input', sourceKey);
                return { data, wait: false, sourceKey };
            }

            const data = getData(type, sourceKey);
            if (data === null) { // data is explicitly null
                return { data: null, wait: false, sourceKey };
            }

            if (data) {
                return { data, wait: false, sourceKey };
            }

            return { data: null, wait: true, sourceKey };
        });

        const keysToWaitFor = results.filter(r => r.wait === true).map(r => r.sourceKey);

        if (keysToWaitFor.length === 0) {
            const dataWaitFor = {};
            results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

            return res(dataWaitFor);
        }

        const dataWaitFor = {};
        results.forEach(result => { dataWaitFor[result.sourceKey] = result.data; });

        waitForOutputs(keysToWaitFor).then(data => {
            res({ ...dataWaitFor, ...data });
        });
    });
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

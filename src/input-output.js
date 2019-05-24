const TYPES = ['input', 'output', 'cache'];

function getAll() {
    const length = localStorage.length;
    const inputs = {};
    const outputs = {};
    const caches = {};

    for (let i = 0; i < length ; i += 1) {
        const key = localStorage.key(i);
        if (key.startsWith('input.')) {
            const trimmed = key.replace('input.', '');
            const data = JSON.parse(localStorage.getItem(key));
            inputs[trimmed] = data;
        }

        if (key.startsWith('output.')) {
            const trimmed = key.replace('output.', '');
            const data = JSON.parse(localStorage.getItem(key));
            outputs[trimmed] = data;
        }

        if (key.startsWith('cache.')) {
            const trimmed = key.replace('cache.', '');
            const data = JSON.parse(localStorage.getItem(key));
            caches[trimmed] = data;
        }
    }

    return { inputs, outputs, caches };
}

function objectToArray(inputs) {
    const arr = Object.keys(inputs).map(key => {
        return { key, data: inputs[key] };
    })

    return arr;
}

function get(type, key) {
    if (!TYPES.includes(type)) {
        throw new Error(`InputOutput.get(): type must be one of ${TYPES.join(', ')}`);
    }

    const inputOrOutput = localStorage.getItem(`${type}.${key}`);

    if (!inputOrOutput) {
        return null;
    }

    return JSON.parse(inputOrOutput);
}

function set(type, key, data) {
    if (!TYPES.includes(type)) {
        throw new Error(`InputOutput.set(): type must be one of ${TYPES.join(', ')}`);
    }

    localStorage.setItem(`${type}.${key}`, JSON.stringify(data));
}


export { getAll, get, set, objectToArray };

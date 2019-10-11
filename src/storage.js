const TYPES_WITHOUT_META = ['input', 'output', 'local', '_'];
const TYPES_WITH_META = ['cache'];
const TYPES = TYPES_WITH_META.concat(TYPES_WITHOUT_META);

export { TYPES };

export function getAll() {
    const all = {};

    for (const type of TYPES) {
        all[type] = {};
    }

    for (let i = 0, length = localStorage.length; i < length; i += 1) {
        const key = localStorage.key(i);
        const type = TYPES.find(t => key.startsWith(`${t}.`));

        if (type === undefined) {
            continue;
        }

        const trimmedKey = key.slice(type.length + 1);
        const parsed = JSON.parse(localStorage.getItem(key));

        all[type][trimmedKey] = TYPES_WITH_META.includes(type) ? (parsed || {}).data : parsed;
    }

    return all;
}

export function objectToArray(inputs) {
    const arr = Object.keys(inputs).map(key => ({ key, data: inputs[key] }));

    return arr;
}

export function get(types, key) {
    for (const type of [].concat(types)) {
        if (!TYPES.includes(type)) {
            throw new Error(`storage.get(): type must be one of ${TYPES.join(', ')}.`);
        }

        const inputOrOutput = localStorage.getItem(`${type}.${key}`);

        if (!inputOrOutput) {
            continue;
        }

        const data = JSON.parse(inputOrOutput);

        return TYPES_WITH_META.includes(type) ? data.data : data;
    }

    return;
}

export function getWithMeta(type, key) {
    if (!TYPES_WITH_META.includes(type)) {
        throw new Error(`storage.getWithMeta(): type must be one of ${TYPES_WITH_META.join(', ')}.`);
    }

    const json = localStorage.getItem(`${type}.${key}`);

    if (json) {
        return JSON.parse(json);
    }
}

export function set(type, key, data) {
    if (!TYPES.includes(type)) {
        throw new Error(`storage.set(): type must be one of ${TYPES.join(', ')}.`);
    }

    localStorage.setItem(`${type}.${key}`, JSON.stringify(data));
}

export function del(type, key) {
    if (!TYPES.includes(type)) {
        throw new Error(`storage.del(): type must be one of ${TYPES.join(', ')}.`);
    }

    localStorage.removeItem(`${type}.${key}`);
}

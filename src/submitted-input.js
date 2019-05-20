function getAll() {
    const length = localStorage.length;
    const inputs = {};

    for (let i = 0; i < length ; i += 1) {
        const key = localStorage.key(i);
        if (key.startsWith('input.')) {
            const trimmed = key.replace('input.', '');
            const data = JSON.parse(localStorage.getItem(key));
            inputs[trimmed] = data;
        }
    }

    return inputs;
}

function objectToArray(inputs) {
    const arr = Object.keys(inputs).map(key => {
        return { key, data: inputs[key] };
    })

    return arr;
}

function get(key) {
    const input = localStorage.getItem(`input.${key}`);
    if (!input) {
        return null;
    }

    return JSON.parse(localStorage.getItem(key));
}

function set(key, data) {
    localStorage.setItem(`input.${key}`, JSON.stringify(data));
}


export { getAll, get, set, objectToArray };

import * as Storage from './storage.js';

export default function getSource(maxType = 'local', key) {
    let source = Storage.get('output', key);

    if (!source && ['cache', 'local', '_'].includes(maxType)) {
        source = Storage.get('cache', key);
    }

    if (!source && ['local', '_'].includes(maxType)) {
        source = Storage.get('local', key);
    }

    if (!source && maxType === '_') {
        source = Storage.get('_', key);
    }

    return source;
}

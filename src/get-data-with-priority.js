import * as Storage from './storage';

export default function getSource(maxType = 'local', key) {
    let source = Storage.get('output', key);

    if (!source && ['cache', 'local'].includes(maxType)) {
        source = Storage.get('cache', key);
    }

    if (!source && maxType === 'local') {
        source = Storage.get('local', key);
    }

    return source;
}

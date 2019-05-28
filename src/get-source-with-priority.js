import Data from '../local-data';
import * as Storage from './input-output';

export default function getSource(maxType = 'data', key) {
    let source = Storage.get('output', key);

    if (!source && ['cache', 'data'].includes(maxType)) {
        source = Storage.get('cache', key);
    }

    if (!source && maxType === 'data') {
        source = Data[key] || null;
    }

    return source;
}

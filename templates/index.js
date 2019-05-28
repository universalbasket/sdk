/** Global */
import { html, until } from '../src/lit-html';
import loading from './loading';
import section from './section';
import templates from './screens/index';

//TODO-test: run this function for all given inputMetas;
export default { loading, section, get };

function get(screen, asyncFunc) {
    let templateFunc = templates[screen];

    if(!templateFunc) {
        throw new Error('No template found for give screen');
    }

    const awaiting = asyncFunc().then(({ data, skip }) => {
        if (skip) {
            return html``;
        }
        return templateFunc(data);
    });

    return html`${until(awaiting, html`<span>Loading....</span>`)}`;
}

/** Global */
import { html, until } from './lit-html';

//TODO-test: run this function for all given inputMetas;
export default get;

function get(template, asyncFunc) {
    const awaiting = asyncFunc().then(({ data, skip }) => {
        if (skip) {
            return html``;
        }
        return template(data);
    });

    return html`${until(awaiting, html`<span>Please wait...</span>`)}`;
}

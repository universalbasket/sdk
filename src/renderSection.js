/** Global */
import { html, until } from './lit-html';
import inlineLoading from './builtin-template/inline-loading';

export default get;

function get(template, waitForData) {
    const awaiting = waitForData().then(({ data, skip }) => {
        if (skip) {
            return html``;
        }
        return template(data);
    });

    return html`${until(awaiting, inlineLoading())}`;
}

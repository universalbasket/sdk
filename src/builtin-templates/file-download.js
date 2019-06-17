import sdk from '../sdk.js';
import { html } from '/web_modules/lit-html/lit-html.js';

const template = ({ filename, url }) => {
    console.info({ filename, url });

    return sdk.sdk.getJobFile(url)
        .then(blob => {
            const a = document.createElement('a');
            const href = URL.createObjectURL(blob);
            a.setAttribute('href', href);
            a.innetText = filename;
            return html`${ a }`;
        })
        .catch(e => {
            console.warn('No blob for us', e);
            return html`bummer`;
        });
};

export default template;


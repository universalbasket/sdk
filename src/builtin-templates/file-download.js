import sdk from '../sdk.js';
import { html } from '/web_modules/lit-html/lit-html.js';

const template = async ({ filename, url }) => {
    const a = document.createElement('a');
    let blob, href;

    try {
        blob = await sdk.getJobFile(url);
    } catch (e) {
        console.error(e);
    }

    if (blob) {
        href = URL.createObjectURL(blob);
        a.setAttribute('href', href);
        a.innetText = filename;
    }

    return blob ? html`${ a }` : '';
};

export default template;


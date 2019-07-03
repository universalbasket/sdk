import { html, until } from '/src/main.js';

const domain = new URLSearchParams(window.location.search).get('domain');
const url = domain ? `/?domain=${domain}` : '/';

const errorMessage = {
    InternalError: 'Internal error occurred.'
};

const defaultErrorMessage = 'You can retry or get in touch with us at configurable@emailaddre.ss.';

async function Template(sdk) {
    const { error } = await sdk.getJob();

    return html`
        <p class="large"><b>We’re sorry. We can’t continue your purchase at the moment.</b></p>
        <p class="dim">${errorMessage[error.code] || defaultErrorMessage}</p>
        <p><a href="${url}" class="button button--primary">Retry</a></p>
    `;
}

export default sdk => until(Template(sdk));

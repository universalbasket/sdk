import { html, until } from '/src/main.js';

const emailAddress = 'configurable@emailaddre.ss';

const errorMessage = {
    TdsTimeout: '3D Secure was not completed in time.',
    PaymentRejected: 'Payment rejected due to a problem with the card.',
    SystemUnavailable: 'Website system is down at the moment.',
    RoomNotAvailable: 'The website claims the room is not available for the selected dates.'
};

const defaultErrorMessage = `You can retry or get in touch with us at ${emailAddress}.`;

async function Template(sdk) {
    const { error } = await sdk.getJob();

    return html`
        <p class="large"><b>We’re sorry. We can’t continue your purchase at the moment.</b></p>
        <p class="dim">${errorMessage[error.code] || defaultErrorMessage}</p>
        <p><a href="/" class="button button--primary">Retry</a></p>
    `;
}

export default sdk => until(Template(sdk));

import { html, until } from '/src/main.js';

const emailAddress = 'configurable@emailaddre.ss';
const phoneNumber = '0000 000 0000';

const errorMessage = {
    TdsTimeout: '3D Secure was not completed in time.',
    PaymentRejected: 'Payment rejected due to a problem with the card.',
    SystemUnavailable: 'Website system is down at the moment.',
    ContactUsToContinue: `Please call us on ${phoneNumber} to continue.`,
    PackageNotAvailable: 'The package is not avaialbe.',
    DirectDebitRejected: 'Direct debit details rejected.',
    BankDetailsInvalid: 'Bank details invalid.',
    OfferNotAvailable: 'The offer is not available, usually expired or not applicable to the user or client.'
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

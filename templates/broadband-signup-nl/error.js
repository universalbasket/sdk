const emailAddress = 'configurable@emailaddre.ss';
const phoneNumber = '0000 000 0000';

const errorMessage = {
    TdsTimeout: '3D Secure was not completed in time.',
    PaymentRejected: 'Payment was rejected due to a problem with the card.',
    SystemUnavailable: 'Website system is down at the moment.',
    ContactUsToContinue: `Please call us on ${phoneNumber} to continue.`,
    PackageNotAvailable: 'The package is not avaialbe.',
    DirectDebitRejected: 'Direct debit details rejected.',
    BankDetailsInvalid: 'Bank details invalid.',
    OfferNotAvailable: 'The offer is not available, usually expired or not applicable to the user or client.',
    AlreadyACustomer: 'It looks like you`re already a customer'
};

const defaultErrorMessage = `You can retry or get in touch with us at ${emailAddress}.`;

export default function error(selector, sdk) {
    return {
        init() {
            const element = document.querySelector(selector);

            element.innerHTML = `
                <p class="large"><b>We're sorry. We can’t continue your purchase at the moment.</b></p>
                <p class="dim" id="message"></p>
            `;

            sdk.getJob().then(
                job => {
                    const message = errorMessage[job.error.code] || defaultErrorMessage;
                    element.querySelector('#message').append(message);
                },
                error => console.warn('Error fetching job:', error.stack)
            );
        }
    };
}

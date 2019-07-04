const domain = new URLSearchParams(window.location.search).get('domain');
const url = domain ? `/?domain=${domain}` : '/';

const errorMessage = {
    TdsTimeout: '3D Secure was not completed in time.',
    PaymentRejected: 'Payment was rejected due to a problem with the card.',
    SystemUnavailable: 'Website system is down at the moment.',
    InternalError: 'Internal error occurred.'
};

const defaultErrorMessage = 'You can retry or get in touch with us at configurable@emailaddre.ss.';

export default (selector, sdk) => {
    return {
        init() {
            const element = document.querySelector(selector);

            element.innerHTML = `
                <p class="large"><b>We’re sorry. We can’t continue your purchase at the moment.</b></p>
                <p class="dim" id="message"></p>
                <p><a href="${url}" class="button button--primary">Retry</a></p>
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
};

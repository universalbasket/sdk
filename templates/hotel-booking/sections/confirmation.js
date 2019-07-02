import { html } from '/src/main.js';

export default (name, { bookingConfirmation }) => html`
        <div>
            <p class="large">
                <b>Booking complete. Thank you.</b>
            </p>
            <p class="dim">
                Your booking reference is <strong>${bookingConfirmation.bookingReference}</strong>.
                You’ll recieve an email confirmation shortly.
            </p>
            <p>
                <a href="/" class="button button--primary">Finish</a>
            </p>
        </div>
    `
;

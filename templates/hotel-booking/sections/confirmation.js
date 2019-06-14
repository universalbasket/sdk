import { html } from '/src/main.js';

export default (name, { bookingConfirmation }) => html`
        <div>
            <h2>Confirmation</h2>
            <p>Thanks for your booking! Your booking reference is <strong>${bookingConfirmation.bookingReference}</strong></p>
        </div>
    `
;

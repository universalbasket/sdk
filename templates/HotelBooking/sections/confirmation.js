import { html } from '/web_modules/lit-html/lit-html.js';

export default (name, { bookingConfirmation }) => html`
        <div>
            <h4>Confirmation</h4>
            <p>Thanks for your booking! Your booking reference is <strong>${bookingConfirmation.bookingReference}</strong></p>
        </div>
    `
;

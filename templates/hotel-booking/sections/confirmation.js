import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

export default function confirmation({ data: { bookingConfirmation } }) {
    return render(html`
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
    `);
}

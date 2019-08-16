import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { Passenger } from '../inputs/index.js';

// https://protocol.automationcloud.net/HotelBooking#MainGuest

export default function guest(name, { search }) {
    return render(html`
        <h2>Passengers</h2>

        ${ search.passengerAges.map((age, i) => {
            return Passenger(i, age)
        })}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Submit</button>
        </div>
    `);
}

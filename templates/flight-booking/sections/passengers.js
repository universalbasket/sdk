import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { Passenger } from '../inputs/index.js';

// https://protocol.automationcloud.net/HotelBooking#MainGuest

export default function guest(name, { search }) {
    return render(html`
        ${ search.passengerAges.map((age, i) => {
            return html `
                ${ i > 0 ? html`<hr><br>`:'' }
                <h2>Passenger ${ i+1 } (${ age >= 18 ? 'Adult':'Child' })</h2>
                ${ Passenger(i, age) }`;
        })}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

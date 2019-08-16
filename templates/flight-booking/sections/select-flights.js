import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';

export default function selectFlights(name, data) {
    const key = Object.keys(data).pop();
    const availableFlights = data[key];

    return render(html`
        <div class="field field--list" data-error="Please select a flight">
            <span class="field__name">${ name }</span>
            ${ availableFlights.map((flight, i) => html`
                <div class="field-item">
                    <div class="field-item__details">
                        <ul class="dim">
                            <li>${ flight.origin.airportCode } - ${ flight.origin.dateTime }</li>
                            <li>${ flight.destination.airportCode } - ${ flight.destination.dateTime }</li>
                        </ul>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="${ name }-$object"
                            id="${ name + '_' + i }"
                            value="${ JSON.stringify(flight) }"
                            required />
                        <label
                            for="${ name + '_' + i}"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${ name }">Continue</button>
        </div>
    `);
}

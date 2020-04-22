import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/src/main.js';
import render from '../render.js';

export default function selectFlights(name, data) {
    const key = Object.keys(data).pop();
    const availableFares = data[key];

    const title = {
        'selected-outbound-fare': 'Select your outbound fare',
        'selected-inbound-fare': 'Now select your inbound fare'
    }[name];

    setTimeout(function () {
        const labels = document.querySelectorAll(`#${ name }-container .field-item label`);
        labels.forEach((label) => {
            label.addEventListener('click', function () {
                setTimeout(function () {
                    document.querySelector(`#submit-btn-${ name }`).click();
                    /*
                    labels.forEach((otherLabel) => {
                        if (otherLabel !== label) {
                            otherLabel.parentNode.parentNode.style.display = 'none';
                        }
                    });
                    */
                }, 20);
            });
        });
    }, 500);

    return render(html`
        <div class="field field--list" data-error="Please select a fare" id="${ name }-container">
            <span class="field__name">${ title }</span>
            ${ availableFares.map((fare, i) => html`
                <div class="field-item">
                    <div class="field-item__details">
                        <ul class="dim">
                            <li>${ fare.fareName } ${ fare.cabinClass }</li>
                            <li>${ templates.priceDisplay(fare.price) }</li>
                        </ul>
                    </div>
                    <div class="field__inputs">
                        <input
                            type="radio"
                            name="${ name }-$object"
                            id="${ name + '_' + i }"
                            value="${ JSON.stringify(fare) }"
                            required />
                        <label
                            for="${ name + '_' + i}"
                            class="button">Select</label>
                    </div>
                </div>
            `) }
        </div>

        <div class="section__actions" style="display: none;">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${ name }">Continue</button>
        </div>
    `);
}

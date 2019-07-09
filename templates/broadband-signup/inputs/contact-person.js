import { html } from '/web_modules/lit-html/lit-html.js';
import Person from './person.js';

export default function contactPerson() {
    return html`
        <div name="contact-person">
            ${Person('contact-person')}

            <div class="field">
                <label
                    class="field__name"
                    for="contact-person[date-of-birth]">Date Of Birth</label>
                <input
                    type="date"
                    name="contact-person[date-of-birth]"
                    required />
            </div>
        </div>
    `;
}

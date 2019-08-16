import { html } from '/web_modules/lit-html/lit-html.js';

// https://protocol.automationcloud.net/HotelBooking#Person
export default (i, age) => html`
    <div class="field">
        <label
            class="field__name"
            for="passengers[${i}][title]">Title</label>
        <select
            name="passengers[${i}][title]"
            id="passengers[${i}][title]"
            required>
            <option value="mr">Mr</option>
            <option value="ms">Ms</option>
            <option value="mrs">Mrs</option>
        </select>
    </div>

    <div class="field">
        <label
            class="field__name"
            for="passengers[${i}][first-name]">First name</label>
        <input
            type="text"
            name="passengers[${i}][first-name]"
            id="passengers[${i}][first-name]"
            pattern="^[A-Za-z]+$"
            data-error="First name should only contain letters (A-Z and a-z)"
            required />
    </div>

    <div class="field">
        <label
            class="field__name"
            for="passengers[${i}][last-name]">Last name</label>
        <input
            type="text"
            name="passengers[${i}][last-name]"
            id="passengers[${i}][last-name]"
            pattern="^[A-Za-z]+$"
            data-error="Last name should only contain letters (A-Z and a-z)"
            required />
    </div>

    <div class="field">
        <label
            class="field__name"
            for="passengers[${i}][dateOfBirth]">Date of birth</label>
        <input
            type="date"
            name="passengers[${i}][dateOfBirth]"
            id="passengers[${i}][dateOfBirth]"
            required />
    </div>
`;

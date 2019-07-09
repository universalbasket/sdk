import { html } from '/web_modules/lit-html/lit-html.js';

import Person from './person.js';
import GuestContact from './guest-contact.js';

// https://protocol.automationcloud.net/HotelBooking#MainGuest
export default () => html`
    ${Person('main-guest')}
    ${GuestContact('main-guest')}
`;

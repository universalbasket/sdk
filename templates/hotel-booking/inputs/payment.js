import { html } from '/src/main.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default otp => html`
    <h2>Guest details</h2>

    <div class="field-set">
        <div class="field" data-error="Field error">
            <label
                class="field__name"
                for="main-guest[person][first-name]">First name</label>
            <input
                type="text"
                name="main-guest[person][first-name]"
                pattern="^[A-Za-z]+$"
                data-error="First name should only contain letters (A-Z and a-z)"
                required />
        </div>

        <div class="field">
            <label
                class="field__name"
                for="main-guest[person][last-name]">Last name</label>
            <input
                type="text"
                name="main-guest[person][last-name]"
                pattern="^[A-Za-z]+$"
                data-error="Last name should only contain letters (A-Z and a-z)"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="main-guest[contact][phone]">Phone number</label>
            <input
                type="text"
                name="main-guest[contact][phone]"
                data-error="Please enter a valid phone number"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="main-guest[contact][email]">Email address</label>
            <input
                type="email"
                name="main-guest[contact][email]"
                pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                data-error="Please enter a valid email address"
                required />
        </div>
    </div>

    <h2>Card details</h2>
    ${PaymentCardIframe(otp)}

    <input type="hidden" name="payment[address][line1]" value="na">
    <input type="hidden" name="payment[address][line2]" value="na">
    <input type="hidden" name="payment[address][city]" value="na">
    <input type="hidden" name="payment[address][countryCode]" value="gb">
    <input type="hidden" name="payment[address][postcode]" value="12345">
    <input type="hidden" name="payment[address][countrySubdivision]" value="na">

    <input type="hidden" name="payment[person][first-name]" value="na">
    <input type="hidden" name="payment[person][last-name]" value="na">
`;

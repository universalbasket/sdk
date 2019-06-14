import { html } from '/src/main.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default otp => html`
    <h2>Guest details</h2>
    <div class="field">
        <label class="field__name" for="main-guest[person][first-name]">First name</label>
        <input type="text" name="main-guest[person][first-name]" placeholder="" required/>
    </div>

    <div class="field">
        <label class="field__name" for="main-guest[person][last-name]">Last name</label>
        <input type="text" name="main-guest[person][last-name]" placeholder="" required/>
    </div>

    <div class="field">
        <label class="field__name" for="main-guest[contact][phone]">Phone number</label>
        <input type="text" name="main-guest[contact][phone]" placeholder="" required/>
    </div>

    <div class="field">
        <label class="field__name" for="main-guest[contact][email]">Email address</label>
        <input type="email" name="main-guest[contact][email]" placeholder="" required/>
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

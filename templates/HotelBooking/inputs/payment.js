import { html } from 'lit-html';
import Address from '../../Generic/Address';
import Person from '../../Generic/Person';

const baseUrl = 'https://vault.automationcloud.net/forms/index.html';

//check available options: https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form
const fields = 'pan,name,expiry-select,cvv_cvv';
const brands = 'visa,mastercard';
const validateOnInput = 'on';
const css = 'https://kk-iframe-prd.glitch.me/style.css'; // todo: host it somewhere proper.

export default (otp) => html`
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
        <input type="text" name="main-guest[contact][email]" placeholder="" required/>
    </div>

    <h2>Card details</h2>
    <iframe
        id="vault-iframe"
        width="400"
        height="280"
        scrolling="no"
        src="${baseUrl}?otp=${otp}&css=${css}&fields=${fields}&brands=${brands}&validateOnInput=${validateOnInput}">
    </iframe>

    <input type="hidden" name="payment[address][line1]" value="na">
    <input type="hidden" name="payment[address][line2]" value="na">
    <input type="hidden" name="payment[address][city]" value="na">
    <input type="hidden" name="payment[address][countryCode]" value="gb">
    <input type="hidden" name="payment[address][postcode]" value="12345">
    <input type="hidden" name="payment[address][countrySubdivision]" value="na">

    <input type="hidden" name="payment[person][first-name]" value="na">
    <input type="hidden" name="payment[person][last-name]" value="na">
`;

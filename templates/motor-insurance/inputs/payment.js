import { html } from '/src/main.js';
import PaymentCardIframe from '../../generic/payment-card-iframe.js';

export default otp => html`
    <h2>Payment details</h2>
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

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
    <h2>Card details</h2>
    <iframe
        id="vault-iframe"
        width="400"
        height="280"
        scrolling="no"
        src="${baseUrl}?otp=${otp}&css=${css}&fields=${fields}&brands=${brands}&validateOnInput=${validateOnInput}">
    </iframe>

    <h2>Billing Address</h2>
    ${Address('payment[address]')}
    ${Person('payment[person]')}
`;

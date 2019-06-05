import { html } from 'lit-html';
import Address from '../../Generic/Address';
import Person from '../../Generic/Person';

const baseUrl = 'https://vault.automationcloud.net/forms/index.html';

//check available options: https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form
const fields = 'pan,name,expiry-select,cvv';
const brands = 'visa,mastercard';
const validateOnInput = 'on';

export default (otp) => html`
    <iframe
        id="vault-iframe"
        width="400"
        height="350"
        src="${baseUrl}?otp=${otp}&fields=${fields}&brands=${brands}&validateOnInput=${validateOnInput}">
    </iframe>

    ${Address('payment[address]')}
    ${Person('payment[person]')}
`;

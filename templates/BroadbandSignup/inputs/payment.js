import { html } from 'lit-html';

const baseUrl = 'https://vault.automationcloud.net/forms/index.html';

//check available options: https://docs.automationcloud.net/docs/vaulting-payment-card#section-styling-and-configuring-the-form
const fields = 'pan,name,expiry-select,cvv';
const brands = 'visa,mastercard';
const validateOnInput = 'on';

export default (otp) => html`
    <h4>otp: ${otp}</h4>
    <iframe
        id="vault-iframe"
        width="400"
        height="400"
        src="${baseUrl}?otp=${otp}&fields=${fields}&brands=${brands}&validateOnInput=${validateOnInput}">
    </iframe>

    <input type="text" name="payment[card][$token]" id="payment-card-token" readonly required>
    <input type="text" name="pan-token" id="payment-pan-token" readonly required>
`;

window.addEventListener("message", receiveMessage, false);

function receiveMessage({ data: message }) {
    console.log(message);
    // Consider security concerns: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
    if (message.name === 'vault.output') {
        document.querySelector('#payment-pan-token').setAttribute('value', message.data && message.data.panToken);
        document.querySelector('#payment-card-token').setAttribute('value', message.data && message.data.cardToken);
    }
}

function submit() {
    document.getElementById("vault-iframe").contentWindow.postMessage('vault.submit', '*');
}


/*
{name: "vault.output", data: {…}}
data:
cardToken: "3454571e-6814-4290-8efc-2f14d3fe60f1"
panToken: "24dc22cc6df823b5922504bb8cda3683-f5502a1b317927cf3e6e163093b736e9-c2f5dd127164dee1d10f7ac5ff9ccc27:3ad64203bf933353a6ad3df968ed1f03-614c10506a0935271769a9893bf8b655"

name: "vault.output"
*/
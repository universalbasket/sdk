import { html } from '/src/main.js';

export default (name, { purchaseConfirmation }) => html`
    <div>
        <h4>Confirmation</h4>
        <p>Thanks for your purchase!</p>
        <span>Here's your reference: <b>${purchaseConfirmation.purchaseReference}</b></span>
    </div>
`;

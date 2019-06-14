import { html } from '/src/main.js';

export default (name, { confirmation }) => html`
    <div>
        <h2>Confirmation</h2>
        <p>Thanks for your purchase!</p>
        <span>Here's your reference: <b>${confirmation.reference}</b></span>
    </div>
`;

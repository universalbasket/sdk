import { html } from '/src/main.js';

export default (name, { purchaseConfirmation }) => html`
        <div>
            <p class="large">
                <b>Purchase complete. Thank you.</b>
            </p>
            <p class="dim">
                Your purchase reference is <strong>${purchaseConfirmation.purchaseReference}</strong>.
                You’ll recieve an email confirmation shortly.
            </p>
            <p>
                <a href="/" class="button button--primary">Finish</a>
            </p>
        </div>
    `
;

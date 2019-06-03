import { html } from 'lit-html';

export default (serviceName, domain) => html`
<div class="summary">
    <div class="summary__header">
        <b>${serviceName}</b>
        <span class="dimmed">${domain}</span>
    </div>

    <section class="summary__body" id="summary-body"></section>
</div>`;

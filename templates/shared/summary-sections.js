import { html } from '/web_modules/lit-html/lit-html.js';

const showModal = (...detail) => new CustomEvent('show-modal', { detail });

export {
    OtherInformation,
    Documents
};

function OtherInformation(outputs = {}) {
    const items = Object.values(outputs)
        .filter(o => ['StructuredText', 'HTML'].includes(o.type))
        .map(o => html`
            <li>
                <span
                    class="popup-icon"
                    @click=${() => window.dispatchEvent(showModal(o))}>
                    <span class="clickable">${o.name}</span>
                </span>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Other information</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;
}

function Documents(outputs = {}) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'File')
        .map(o => html`
            <li class="file-icon">
                <a href="${o.url}" target="_blank">${o.filename}</a>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Documents</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;

}

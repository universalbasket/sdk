import { html, render } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from './price-display.js'

export default function (body, title) {
    if (!body || typeof body !== 'object') {
        return ''
    }

    switch (body.type) {
        case 'html': return showModal(body, title);
        case 'StructuredText': return showModal(getContentsHtml(body.contents), body.name);
        default: return '';
    }
}

function close() {
    render('', document.querySelector('#modal'))
}

function showModal(details, title) {
    return html`
        <div class="modal-wrapper">
            <div class="modal">
                <div class="modal__header">
                    <h2 class="large">${title}</h2>
                </div>
                <div class="modal__body">${details}</div>
                <span
                    class="modal__close"
                    @click="${close}">
                </span>
            </div>
            <div
                class="modal-wrapper__overlay"
                @click=${close}></div>
        </div>
        `;
}

function getContentsHtml(contents) {
    if (!Array.isArray(contents)) {
        return ''
    }
    return html`${
        contents.map(item => {
            if (item.type === 'StructuredText') {
                return html`
                    <article>
                        <header>
                            <b>${item.name}</b>
                        </header>
                        <div class="dim">${getContentsHtml(item.contents)}</div>
                    </article>`;
            }
            if (item.type === 'Text') {
                return html`<p>${item.text}</p>`
            }
            if (item.type === 'NamedPrice') {
                return html`<p>
                    ${item.name}
                    ${PriceDisplay(item.price)}
                </p>`
            }
            return '';
        })
    }`
}

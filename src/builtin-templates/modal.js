import { html, render } from '/web_modules/lit-html.js';
import PriceDisplay from './price-display.js'

const template = ({name, contents, type}) => {
    let body = contents;
    if (type === 'StructuredText') {
        body = getContentsHtml(contents);
    }

    return html`
        <div class="modal-wrapper">
            <div class="modal">
                <div class="modal__header">
                    <h2 class="large">${name}</h2>
                </div>
                <div class="modal__body">${body}</div>
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

export default template;

function close() {
    render('', document.querySelector('#modal'))
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

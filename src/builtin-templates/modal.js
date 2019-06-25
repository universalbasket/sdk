import { html, render } from '/web_modules/lit-html/lit-html.js';
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js';

import PriceDisplay from './price-display.js';

export default function create(body, { title = '', isLocked = false } = {}) {
    const templateResult = wrap(body, title, isLocked);

    return {
        templateResult,
        show: () => { show(templateResult); },
        fake: () => { show(wrap(body, title, isLocked, true)); },
        close
    };
}

function show(templateResult) {
    render(templateResult, document.querySelector('#modal'));
}

function wrap(body, title, isLocked, isHidden = false) {
    if (!body || typeof body !== 'object') {
        return '';
    }

    switch (body.type) {
        case 'html': return wrapper(body, title, isLocked, isHidden);
        case 'HTML': return wrapper(unsafeHTML(body.html), body.name, isLocked, isHidden);
        case 'StructuredText': return wrapper(getContentsHtml(body.contents), body.name, isLocked, isHidden);
        default: return '';
    }
}

function close() {
    render('', document.querySelector('#modal'));
}

function wrapper(details, title, isLocked, isHidden) {
    return html`
        <div
            class="modal-wrapper ${ isHidden ? 'modal-wrapper--hidden' : '' }">
            <div class="modal ${ isLocked ? 'modal--locked' : '' }">
                ${ header(title) }
                <div class="modal__body">${ details }</div>
                ${ closeBtn(isLocked) }
            </div>
            <div
                class="modal-wrapper__overlay"
                @click=${ isLocked ? () => {} : close }></div>
        </div>`;
}

function header(title) {
    if (title) {
        return html`
            <div class="modal__header">
                <h2 class="large">${title}</h2>
            </div>`;
    }
}

function closeBtn(isLocked) {
    if (!isLocked) {
        return html`<span class="modal__close" @click=${ close }></span>`;
    }
}

function getContentsHtml(contents) {
    if (!Array.isArray(contents)) {
        return '';
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

            switch (item.type) {
                case 'Text': return html`<p>${item.text}</p>`;
                case 'Link': return html`<a href="${item.url}" target="_blank">${item.name}</a>`;
                case 'HTML': return unsafeHTML(item.html);
                case 'NamedText': return html`<p>${item.name} – ${item.text}</p>`;
                case 'NamedPrice': return html`<p>${item.name} – ${PriceDisplay(item.price)}</p>`;
                default: return '';
            }
        })
    }`;
}

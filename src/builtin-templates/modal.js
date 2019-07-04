import { html, render } from '/web_modules/lit-html/lit-html.js';

export default function create(body, { title = '', isLocked = false } = {}) {
    const templateResult = wrap(body, title, isLocked);

    return {
        templateResult,
        show: () => show(templateResult),
        fake: () => show(wrap(body, title, isLocked, true)),
        close
    };
}

function show(templateResult) {
    render(templateResult, document.querySelector('#modal'));
}

function close() {
    render('', document.querySelector('#modal'));
}

function wrap(details, title, isLocked, isHidden = false) {
    if (!details) {
        return;
    }

    return html`
        <div
            class="modal-wrapper ${isHidden ? 'modal-wrapper--hidden' : ''}">
            <div class="modal ${isLocked ? 'modal--locked' : ''}">
                ${wrapHeader(title)}
                <div class="modal__body">${details}</div>
                ${wrapCloseBtn(isLocked)}
            </div>
            <div
                class="modal-wrapper__overlay"
                @click=${isLocked ? () => {} : close}></div>
        </div>`;
}

function wrapHeader(title) {
    if (title) {
        return html`
            <div class="modal__header">
                <h2 class="large">${title}</h2>
            </div>`;
    }
}

function wrapCloseBtn(isLocked) {
    if (!isLocked) {
        return html`<span class="modal__close" @click=${close}></span>`;
    }
}



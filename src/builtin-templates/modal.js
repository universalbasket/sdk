import { html, render } from '/web_modules/lit-html.js';

const template = ({title, content}) => html`
<div class="modal-wrapper">
    <div class="modal">
        <div class="modal__header">
            <h2 class="large">${title}</h2>
        </div>
        <div class="modal__body">${content}</div>
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

export default template;

function close() {
    render('', document.querySelector('#modal'))
}

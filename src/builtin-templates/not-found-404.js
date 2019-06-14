import { html } from '/web_modules/lit-html/lit-html.js';

export default () => {
    return html`
    <div class="page">
        <h2>Uh oh, We cannot find the page</h2>
        <button type="button" class="button button--right button--primary" id="submitBtn" @click="${() => { window.location.hash = '/#';}}">Continue</button>
    </div>
    `;
};

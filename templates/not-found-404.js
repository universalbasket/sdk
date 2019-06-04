import { html } from '/web_modules/lit-html.js';

export default () => {
    return html`
    <div>
        <h1>Uh oh, We cannot find the page!</h1>
        <p>404</p>
        <button type="button" class="button button--right button--primary" id="submitBtn" @click="${() => { window.location.hash = '/#';}}">Continue</button>
    </div>
    `;
}

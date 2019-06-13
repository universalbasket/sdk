import { html } from '/web_modules/lit-html/lit-html.js';

export default () => html`
<div class="inline-loading">
    <span class="spinner">
        <span class="spinner__bar1 spinner__bar"></span>
        <span class="spinner__bar2 spinner__bar"></span>
        <span class="spinner__bar3 spinner__bar"></span>
        <span class="spinner__bar4 spinner__bar"></span>
        <span class="spinner__bar5 spinner__bar"></span>
        <span class="spinner__bar6 spinner__bar"></span>
        <span class="spinner__bar7 spinner__bar"></span>
        <span class="spinner__bar8 spinner__bar"></span>
    </span>

    <span>Please wait a moment</span>
</div>
`;

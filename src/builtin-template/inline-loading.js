import { html } from '../lit-html';

export default () => html`
<div class="inline-loading">
    <div class="spinner">
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
    </div>

    <span>Please wait a moment</span>
</div>
`
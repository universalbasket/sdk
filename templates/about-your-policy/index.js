import { html } from '../../src/lit-html';

/* templates */
import policyOptions from './policy-options';

export default () => {
    return html`
<div class="section">
    <h3 class="section__header">About Your Policy</h3>
    <form class="section__body" id="about-your-policy">
        ${policyOptions()}
    </form>

    <button type="button" class="button button--right button--primary" id="submit">Continue</button>
</div>
`
}
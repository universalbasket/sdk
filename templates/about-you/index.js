import { html, render } from '../../src/lit-html';

/* templates */
import owner from './owner';
import account from './account';

export default () => {
    return html`
<div class="section">
    <h3 class="section__header">About you</h3>
    <form class="section__body"id="about-you">
        ${account()}
        ${owner(availableMaritalStatusOptions)}
    </form>

    <button type="button" class="button button--right button--primary" id="submit">Continue</button>
</div>
`
}

/* get it from previous output */
const availableMaritalStatusOptions = [
    "Civil Partner",
    "Cohabiting",
    "Divorced",
    "Married",
    "Separated",
    "Single",
    "Widowed"
];

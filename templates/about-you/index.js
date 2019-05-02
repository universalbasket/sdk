import { html } from '../../src/lit-html';

/* templates */
import owner from './owner';

export default () => html`
<div>
    <h3>About you</h3>
    <form id="about-you">
        ${owner()}
    </form>

    <button type="button" id="submit-about-you">Next</button>
</div>
`

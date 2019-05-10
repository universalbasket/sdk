import { html } from '../../src/lit-html';

export default () => html`
<div class="section">
    <h3 class="section__header">Your Covers</h3>
    <form class="section__body">
        <div>
            <input id="pan" name="pan" type="tel" value="4242424242424242"></input>
        </div>
    </form>

    <button type="button" class="button button--right button--primary" id="submit-payment">Continue</button>
</div>
`;

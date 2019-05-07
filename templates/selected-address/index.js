import { html, render } from '../../src/lit-html';
import getOutput from '../../src/get-output';

/* templates */
import addresses from './selected-address';

export default () => {
    getAddresses();
    return html`
<div class="section">
    <h3 class="section__header">selected Address</h3>
    <form class="section__body"id="selected-address">
        <div id="selected-address">
            loading your address....
        </div>
    </form>

    <button type="button" class="button button--right button--primary" id="submit-selected-address">Continue</button>
</div>
`
}

function getAddresses() {
    getOutput({inputMethod: "SelectOne",  sourceOutputKey: 'availableAddresses'}, (err, output) => {
        if (err) {
            return;
        }
        render(addresses(output), document.querySelector('#selected-address'));
    })
}
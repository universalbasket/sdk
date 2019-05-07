import { html, render } from '../../src/lit-html';
import getOutput from '../../src/get-output';

/* templates */
import selectedCover from './selected-cover';
import selectedInput from '../selected-input';

export default () => {
    return html`
<div class="section">
    <h3 class="section__header">Selected Cover</h3>
    <form class="section__body" id="selected-cover">
        <div id="selected-input-wrapper">
            please wait....
        </div>
    </form>

    <button type="button" class="button button--right button--primary" id="submit-selected-cover">Continue</button>
</div>
`
}

const metas = [
    {
        title: 'Select your cover',
        inputKey: 'selectedCover',
        inputMethod: "SelectOne",
        sourceOutputKey: 'availableCovers'
    },
    {
        inputKey: 'selectedVetPaymentTerm',
        inputMethod: "SelectOne",
        sourceOutputKey: 'availableVetPaymentTerms'
    }
];

function renderSelectOneInput(meta) {
    getOutput(meta, (err, output) => {
        if (err) {
            return;
        }
        render(selectedInput(inputKey, output), document.querySelector('#selected-input-wrapper'));
    })
}

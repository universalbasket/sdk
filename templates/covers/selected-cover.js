import { html } from '../../src/lit-html';

const renderCovers = (covers) => html`
<div class="field">
    <span class="field__name">Select cover</span>
    <select name="selected-cover">
        ${ covers.map(b => html`
            <option value="${b}"> ${b}</option>`
        )}
    </select>
</div>
`;

export default (covers) => html`
    ${covers && Array.isArray(covers) ?
        renderCovers(covers) :
        ''
    }
`;

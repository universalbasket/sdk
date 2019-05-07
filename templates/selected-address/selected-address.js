import { html } from '../../src/lit-html';

const renderAddresses = (addresses) => html`
<div class="field">
    <span class="field__name">What is your address?</span>
    <select name="selected-address">
        ${ addresses.map(b => html`
            <option value="${b}"> ${b}</option>`
        )}
    </select>
</div>
`;

export default (addresses) => html`
    ${addresses && Array.isArray(addresses) ?
        renderAddresses(addresses) :
        ''
    }
`;

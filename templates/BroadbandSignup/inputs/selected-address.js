import { html, render } from '../../../src/lit-html';
const key = 'selected-address';

export default (addresses) => html`
    <div class="field field-set">
        <span class="field__name">Select Your Address</span>
        <select name="${key}" @change="${onChange}" required>
            <option>select address...</option>
            ${ addresses.map(address => html`
                <option value="${address}"> ${address}</option>`
            )}
        </select>
        <div id="clone-address"></div>
    </div>
`;

const cloneAddress = (address) => html`
<input type="hidden" name="selected-installation-address" value="${address}" required>
`;

const onChange = {
    // handleEvent method is required.
    handleEvent(e) {
        const selectedAddress = e.target.value;
        render(cloneAddress(selectedAddress), document.querySelector('#clone-address'));
    },
// event listener objects can also define zero or more of the event
// listener options: capture, passive, and once.
};


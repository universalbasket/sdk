import { html, render } from '/src/main.js';
let installationAddresses = [];

const cloneAddress = address => html`
    <input
        type="hidden"
        name="selected-installation-address"
        value="${address}" />
`;

const onChange = {
    handleEvent(e) {
        const selectedAddress = e.target.value;
        const [numberOrName] = selectedAddress.split(',');
        const match = installationAddresses.find(addr => {
            const [firstPart] = addr.split(' ');
            return numberOrName === firstPart;
        });

        render(cloneAddress(match), document.querySelector('#selected-installation-address'));
    }
};

export default (name, { availableAddresses, availableInstallationAddresses }) => {
    installationAddresses = availableInstallationAddresses;
    return html`
        <div class="field field-set">
            <span class="field__name">Select Your Address</span>
            <select name="selected-address" @change="${onChange}" required>
                <option>select address...</option>
                ${ availableAddresses.map(address => html`<option value="${address}"> ${address}</option>`) }
            </select>
        </div>
        <div id="selected-installation-address"></div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

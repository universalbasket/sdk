import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

let installationAddresses = [];

export default function selectedAddresses({ name, data: { availableAddresses, availableInstallationAddresses } }) {
    installationAddresses = availableInstallationAddresses;
    return render(html`
        <div class="field field-set">
            <span class="field__name">Select Your Address</span>
            <select name="selected-address" @change="${onChange}" required>
                <option>select address...</option>
                ${ availableAddresses.map(address => html`<option value="${ address }"> ${ address }</option>`) }
            </select>
        </div>
        <div id="selected-installation-address"></div>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name }">Continue</button>
        </div>
    `);
}

function onChange(e) {
    const selectedAddress = e.target.value;
    const [numberOrName] = selectedAddress.split(',');
    const matches = installationAddresses.filter(addr => {
        const [firstPart] = addr.split(' ');
        return numberOrName === firstPart;
    });

    const match = matches.length === 1 ? matches[0] : null;
    let similarAddresses = [];

    if (!match) {
        similarAddresses = installationAddresses.filter(addr => addr.includes(numberOrName));
        if (similarAddresses.length === 0) {
            similarAddresses = installationAddresses;
        }
    }

    const selectedInstallationAddress = document.querySelector('#selected-installation-address');

    while (selectedInstallationAddress.lastChild) {
        selectedInstallationAddress.removeChild(selectedInstallationAddress.lastChild);
    }

    selectedInstallationAddress.appendChild(render(InstallationAddress(match, similarAddresses)));
}

function InstallationAddress(address, similarAddresses) {
    if (address) {
        return html`<input type="hidden" name="selected-installation-address" value="${address}" />`;
    }

    return html`
        <p>Please select your installation address</p>
        <span class="field__name">Select Your Installation Address</span>
        <select name="selected-installation-address" required>
            <option>select address...</option>
            ${ similarAddresses.map(address => html`<option value="${ address }"> ${ address }</option>`) }
        </select>
    `;
}

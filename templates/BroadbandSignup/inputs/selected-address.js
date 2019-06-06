import { html, render } from '/web_modules/lit-html/lit-html.js';

export default (addresses) => html`
    <div class="field field-set">
        <span class="field__name">Select Your Address</span>
        <select name="selected-address" required>
            <option>select address...</option>
            ${ addresses.map(address => html`
                <option value="${address}"> ${address}</option>`
            )}
        </select>
        <div id="clone-address"></div>
    </div>
`;

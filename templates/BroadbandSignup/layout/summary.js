import { html } from '/web_modules/lit-html.js';

//get service name & domain
export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block">
            <h5 class="summary__block-title"> Your Package </h5>
            <ul>
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`TV : <li> ${inputs.selectedTvPackages.map(_ => _.name)}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
            </ul>
        </div>` : ''}
</div>`;

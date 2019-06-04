import { html } from 'lit-html';

//get service name & domain
export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${ console.info(inputs)}
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block">
            <ul>
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`<li> TV: ${inputs.selectedTvPackages.map(_ => _.name).join(', ')}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
            </ul>
        </div>` : ''}
    <b class="highlight">£14.99</b>
</div>`;

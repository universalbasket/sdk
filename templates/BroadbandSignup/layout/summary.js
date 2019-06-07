import { html } from '/web_modules/lit-html/lit-html.js';
import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

export default (inputs = {}, outputs = {}, cache = {}, _local = {}) => html`
<div>
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block ${cache.finalPrice ? 'summary__block--list' : ''}">
            <ul class="dim">
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`<li> TV: ${inputs.selectedTvPackages.map(_ => _.name).join(', ')}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
            </ul>
        </div>` : ''}

    ${PriceInformation({ cache, outputs })}
    ${Documents({ outputs })}
    ${OtherInformation({ outputs })}
</div>`;

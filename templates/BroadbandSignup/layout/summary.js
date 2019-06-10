import { html } from '/web_modules/lit-html/lit-html.js';
import { ifDefined } from '/web_modules/lit-html/directives/if-defined.js';

import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

export default (inputs = {}, outputs = {}, cache = {}, _local = {}) => {
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');
    return html`
        <div>
        ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
            <div id="package-detail" class="summary__block">
                <ul class="dim">
                    <li>Broadband: ${ifDefined(inputs.selectedBroadbandPackage.name)}</li>
                    <li>TV: ${ifDefined(selectedTvPackages)}</li>
                    <li>Phone: ${ifDefined(inputs.selectedPhonePackage.name)}</li>
                </ul>
            </div>` : ''}

        ${PriceInformation({ cache, outputs })}
        ${Documents({ outputs })}
        ${OtherInformation({ outputs })}
        </div>`;
};

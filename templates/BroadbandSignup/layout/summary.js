import { html } from '/web_modules/lit-html/lit-html.js';

import PriceDisplay from '../../../src/builtin-templates/price-display.js'

const showModal = (...detail) => new CustomEvent('show-modal', {detail});

export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block ${cache.finalPrice ? 'summary__block--list' : ''}">
            <ul class="dim">
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`<li> TV: ${inputs.selectedTvPackages.map(_ => _.name).join(', ')}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
            </ul>
        </div>` : ''
    }

    ${cache.finalPrice ?
        html`<div class="summary__block">
            <b class="large highlight">
                ${PriceDisplay(cache.finalPrice)}
            </b>
        </div>` :
        ''
    }

    <div class="summary__block summary__block--docs">
        <p><b>Documents</b></p>
        <ul class="dim">
            <li class="file-icon">Insurance product information</li>
            <li class="file-icon">Essential information</li>
            <li class="file-icon">Policy wording</li>
        </dim>
    </div>

    ${getOtherInformationSection(outputs)}
</div>`;

function getOtherInformationSection(outputs) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'StructuredText')
        .map(o => html`
            <li>
                <span
                    class="popup-icon"
                    @click=${() => window.dispatchEvent(showModal(o))}>
                    <span class="clickable">${o.name}</span>
                </span>
            </li>`)

    if (items.length === 0) {
        return ''
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Other information</b></p>
            <ul class="dim">${ items }</ul>
        </div>`
}

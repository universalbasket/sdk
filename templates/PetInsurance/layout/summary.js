import { html } from '/web_modules/lit-html/lit-html.js';

import PriceDisplay from '../../../../src/builtin-templates/price-display.js'
import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js'

export default (inputs = {}, outputs = {}, _cache = {}, _local = {}) => html`
<div>
    ${
        inputs.policyOptions || inputs.selectedCover || inputs.selectedVoluntaryExcess || inputs.selectedPaymentTerm ?
            html`
                <article id="policy-detail" class="summary__block">
                    <ul class="dim">
                        ${inputs.policyOptions && inputs.policyOptions.coverStartDate ? StartDate(inputs.policyOptions) : ''}
                        ${inputs.selectedCover ? html`<li>Cover: ${inputs.selectedCover}</li>` : ''}
                        ${inputs.selectedVetPaymentTerm ? html`<li> Vet Payment Term: ${inputs.selectedVetPaymentTerm}</li>` : ''}
                        ${inputs.selectedPaymentTerm ? html`<li>Payment term: ${inputs.selectedPaymentTerm}</li>` : ''}
                        ${inputs.selectedCoverType ? html`<li>Cover type: ${inputs.selectedCoverType.coverName} - ${(inputs.selectedCoverType.price.value * 0.01).toFixed(2)} ${inputs.selectedCoverType.price.currencyCode} </li>` : ''}
                        ${inputs.selectedVetFee ? html`<li>Vet Fee:  - <p>${inputs.selectedVetFee.price.value * 0.01} ${inputs.selectedVetFee.price.currencyCode} </li>` : ''}
                        ${inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${inputs.selectedVoluntaryExcess.name}</li>` : ''}
                        ${inputs.selectedCoverOptions ? html`<li>Cover options: ${inputs.selectedCoverOptions.map(_ => _.name)}</li>` : ''}
                    </ul>
                </article>` :
            ''
    }

    ${inputs.pets ?
        html`
            <article id="pet-detail"  class="summary__block">
                ${Pet(inputs.pets[0])}
            </article>` :
        ''
    }

    ${
        outputs.insuranceProductInformationDocument || outputs.essentialInformation || outputs.policyWording || outputs.eligibilityConditions ?
            html`
                <article id="policy-info" class="summary__block">
                    <header class="summary__block-title">
                        Your Documents
                    </header>
                    <ul>
                        ${outputs.insuranceProductInformationDocument ? FileType(outputs.insuranceProductInformationDocument) : ''}
                        ${outputs.essentialInformation ? FileType(outputs.essentialInformation) : ''}
                        ${outputs.policyWording ? FileType(outputs.policyWording) : ''}
                        ${outputs.eligibilityConditions ? HtmlType(outputs.eligibilityConditions) : ''}
                    </ul>
                </article>` :
            ''
    }

    <div id="price">
        ${PriceInformation({ cache: _cache, outputs })}
    </div>

    ${OtherInformation({ outputs })}
    ${Documents({ outputs })}
</div>`;

const Pet = (pet) => html`
    <header class="summary__block-title">
        Your ${pet.name}
    </header>
    <ul class="dim">
        <li> Breed Name: ${pet.breedName}</li>
        <li> Date of Birth: ${pet.dateOfBirth}</li>
        <li> Paid/Donated: ${PriceDisplay({
            currencyCode: 'gbp',
            value: pet.petPrice
        })}</li>
    </ul>
`;

const StartDate = (policyOptions) => {
    const { coverStartDate } = policyOptions;
    return html`
        <li>
            Starts on ${coverStartDate}
        </li>
    `;
}

const FileType = (data) => {
    return html`
        <div>
            <h5>${data.name}</h5>
            <a>${data.filename}</a>
        </div>
    `;
}

const HtmlType = (data) => {
    return html`
        <div>
            <h5>${data.name}</h5>
            <pre style="display:none">${data.html}</pre>
        </div>
    `;
}

function price(data) {
    return html`
        <h5>Price</h5>
        <span>${(data.price.value * 0.01).toFixed(2)} ${data.price.countryCode}</span>
    `;
}

/**
 *
 *  insuranceProductInformationDocument
 *  essentialInformation
 *  policyWording
 *  eligibilityConditions
 *  estimatedPrice
 *
 */

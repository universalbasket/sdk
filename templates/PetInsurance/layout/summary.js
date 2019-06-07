import { html } from '/web_modules/lit-html/lit-html.js';

import PriceDisplay from '../../../../src/builtin-templates/price-display.js';
import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${ inputs.policyOptions || inputs.selectedCover || inputs.selectedVoluntaryExcess || inputs.selectedPaymentTerm ?
        html`
            <article class="summary__block">
                <ul class="dim">
                    ${inputs.policyOptions && inputs.policyOptions.coverStartDate ? html`<li>Starts on ${inputs.policyOptions.coverStartDate}</li>` : ''}
                    ${inputs.selectedCover ? html`<li>Cover: ${inputs.selectedCover}</li>` : ''}
                    ${inputs.selectedVetPaymentTerm ? html`<li> Vet Payment Term: ${inputs.selectedVetPaymentTerm}</li>` : ''}
                    ${inputs.selectedPaymentTerm ? html`<li>Payment term: ${inputs.selectedPaymentTerm}</li>` : ''}
                    ${inputs.selectedCoverType ? html`<li>Cover type: ${inputs.selectedCoverType.coverName} - ${(inputs.selectedCoverType.price.value * 0.01).toFixed(2)} ${inputs.selectedCoverType.price.currencyCode} </li>` : ''}
                    ${inputs.selectedVetFee ? html`<li>Vet Fee:  - <p>${inputs.selectedVetFee.price.value * 0.01} ${inputs.selectedVetFee.price.currencyCode} </li>` : ''}
                    ${inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${inputs.selectedVoluntaryExcess.name}</li>` : ''}
                    ${inputs.selectedCoverOptions ? html`<li>Cover options: ${inputs.selectedCoverOptions.map(_ => _.name)}</li>` : ''}
                </ul>
            </article>` :
        ''}

    ${ inputs.pets ?
        html`
            <article class="summary__block">
                ${ Pet(inputs.pets[0], local.currencyCode) }
            </article>` :
        ''}

    ${ PriceInformation({ cache, outputs }) }
    ${ OtherInformation({ outputs }) }
    ${ Documents({ outputs }) }
</div>`;

function Pet(pet, currencyCode = 'gbp') {
    return html`
        <header class="summary__block-title">
            Your ${ pet.name }
        </header>
        <ul class="dim">
            <li>Breed Name: ${ pet.breedName }</li>
            <li>Date of Birth: ${ pet.dateOfBirth }</li>
            <li>Paid/Donated: ${ PriceDisplay({ currencyCode, value: pet.petPrice })}</li>
        </ul>
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

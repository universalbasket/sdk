import { html } from '/web_modules/lit-html/lit-html.js';
import { ifDefined } from '/web_modules/lit-html/directives/if-defined.js';

import PriceDisplay from '../../../src/builtin-templates/price-display.js';
import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

export default (inputs = {}, outputs = {}, cache = {}, local = {}) => {
    const selectedCoverOptions = (inputs.selectedCoverOptions || []).map(_ => _.name).join(', ');

    return html`
        ${ inputs.policyOptions || inputs.selectedCover || inputs.selectedVoluntaryExcess || inputs.selectedPaymentTerm ?
        html`
            <article class="summary__block">
                <ul class="dim">
                    <li>Starts on ${ ifDefined(inputs.policyOptions.coverStartDate) }</li>
                    <li>Cover: ${ ifDefined(inputs.selectedCover) }</li>
                    <li> Vet Payment Term: ${ ifDefined(inputs.selectedVetPaymentTerm) }</li>
                    <li>Payment term: ${ ifDefined(inputs.selectedPaymentTerm) }</li>
                    ${ CoverType(inputs.selectedCoverType) }
                    ${ VetFee(inputs.selectedVetFee) }
                    <li>Voluntary Excess: ${ ifDefined(inputs.selectedVoluntaryExcess.name) }</li>
                    <li>Cover options: ${ ifDefined(selectedCoverOptions) }</li>
                </ul>
            </article>` :
        ''}

        ${ PetInfo({ pets: inputs.pets, currencyCode: local.currencyCode })}
        ${ PriceInformation({ cache, outputs }) }
        ${ OtherInformation({ outputs }) }
        ${ Documents({ outputs }) }`;
};

function VetFee(selectedVetFee) {
    if (!selectedVetFee) {
        return '';
    }
    return html`<li>
        Vet Fee:
        -
        ${ PriceDisplay(selectedVetFee.price) }
    </li>`;
}

function CoverType(selectedCoverType) {
    if (!selectedCoverType) {
        return '';
    }
    return html`<li>
        Cover type:
        ${selectedCoverType.coverName}
        -
        ${ PriceDisplay(selectedCoverType.price) }
    </li>`;
}

function PetInfo({ pets = [], currencyCode }) {
    if (!pets[0]) {
        return '';
    }
    return html`
    <article class="summary__block">
        ${ Pet(pets[0], currencyCode) }
    </article>`;
}

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

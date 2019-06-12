import { html } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from '../../../src/builtin-templates/price-display.js';

const keyInputs = [
    'policyOptions',
    'selectedCover',
    'selectedCoverType',
    'selectedCoverOptions',
    'selectedVoluntaryExcess',
    'selectedVetPaymentTerm',
    'selectedVetFee',
    'selectedPaymentTerm'
];

import {
    OtherInformation,
    MobileSummaryWrapper,
    Documents
} from '../../shared/summary.js';

export default {
    MobileTemplate,
    DesktopTemplate
};

function SummaryDetails(inputs, outputs, cache) {
    const price = getPrice(outputs, cache);

    return html`
    <div class="summary__body">
        ${ hasContent(inputs) ? html`
            <article class="summary__block">
                <ul class="dim">
                    ${ inputs.policyOptions.coverStartDate ? html`<li>Starts on: ${ inputs.policyOptions.coverStartDate }</li>` : '' }
                    ${ inputs.selectedCover ? html`<li>Cover: ${ inputs.selectedCover }</li>` : '' }
                    ${ inputs.selectedVetPaymentTerm ? html`<li>Vet Payment Term: ${ inputs.selectedVetPaymentTerm }</li>` : '' }
                    ${ inputs.selectedPaymentTerm ? html`<li>Payment term: ${ inputs.selectedPaymentTerm }</li>` : '' }
                    ${ inputs.selectedCoverType ? html`<li>${ CoverType(inputs.selectedCoverType) }</li>` : '' }
                    ${ inputs.selectedVetFee ? html`<li>${ VetFee(inputs.selectedVetFee) }</li>` : '' }
                    ${ inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${ inputs.selectedVoluntaryExcess.name }</li>` : '' }
                    ${ inputs.selectedCoverOptions ? html`<li>Cover options: ${ inputs.selectedCoverOptions.map(_ => _.name).join(', ') }</li>` : '' }
                </ul>
            </article>` :
        '' }

        ${ price ? html`
            <div class="summary__block summary__block--price">
                <b class="large highlight">
                    ${ PriceDisplay(price) }
                </b>
            </div>` :
        '' }

        ${ PetInformation(inputs) }
        ${ Documents(outputs) }
        ${ OtherInformation(outputs) }
    </div>`;
}

function SummaryPreview(inputs, outputs, cache) {
    const price = getPrice(outputs, cache);

    return html`
        <b class="large summary__preview-price">
            ${ PriceDisplay(price || { currencyCode: 'gbp' }) }
        </b>

        ${ hasContent(inputs) ? html`
            <span class="faint summary__preview-info">
                ${ inputs.policyOptions.coverStartDate ? html`<span>Starts on: ${ inputs.policyOptions.coverStartDate }</span>` : '' }
                ${ inputs.selectedCover ? html`<span>Cover: ${ inputs.selectedCover }</span>` : '' }
                ${ inputs.selectedVetPaymentTerm ? html`<span>Vet Payment Term: ${ inputs.selectedVetPaymentTerm }</span>` : '' }
                ${ inputs.selectedPaymentTerm ? html`<span>Payment term: ${ inputs.selectedPaymentTerm }</span>` : '' }
                ${ inputs.selectedCoverType ? html`<span>${ CoverType(inputs.selectedCoverType) }</span>` : '' }
                ${ inputs.selectedVetFee ? html`<span>${ VetFee(inputs.selectedVetFee) }</span>` : '' }
                ${ inputs.selectedVoluntaryExcess ? html`<span>Voluntary Excess: ${ inputs.selectedVoluntaryExcess.name }</span>` : '' }
                ${ inputs.selectedCoverOptions ? html`<span>Cover options: ${ inputs.selectedCoverOptions.map(_ => _.name).join(', ') }</span>` : '' }
            </span>` :
        '' }`;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Pet Insurance</span>
    `;
}

function getPrice(outputs, cache) {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    return priceObj && priceObj.price;
}

function hasContent(inputs) {
    return !!Object.keys(inputs).find(key => keyInputs.includes(key));
}

function VetFee(selectedVetFee) {
    if (!selectedVetFee) {
        return '';
    }
    return html`Vet Fee: - ${ PriceDisplay(selectedVetFee.price) }`;
}

function CoverType(selectedCoverType) {
    if (!selectedCoverType) {
        return '';
    }
    return html`Cover type: ${selectedCoverType.coverName}
    - ${ PriceDisplay(selectedCoverType.price) }`;
}

function PetInformation(inputs, currencyCode = 'gbp') {
    const pets = inputs.pets || [];

    if (!pets[0]) {
        return '';
    }

    return html`
    <article class="summary__block">
        <header class="summary__block-title">
            Your ${ pets[0].name }
        </header>
        <ul class="dim">
            <li>Breed Name: ${ pets[0].breedName }</li>
            <li>Date of Birth: ${ pets[0].dateOfBirth }</li>
            <li>Paid/Donated: ${ PriceDisplay({ currencyCode, value: pets[0].petPrice })}</li>
        </ul>
    </article>`;
}

function DesktopTemplate(inputs, outputs, cache, _) {
    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
        ${ SummaryDetails(inputs, outputs, cache) }
    </aside>`;
}

function MobileTemplate(inputs, outputs, cache, _) {
    return MobileSummaryWrapper(inputs, outputs, cache, _,
        SummaryPreview, SummaryTitle, SummaryDetails, hasContent);
}

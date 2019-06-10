import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

import PriceDisplay from '../../../src/builtin-templates/price-display.js';

const toggleSummary = new CustomEvent('toggle-summary');
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
    Documents
} from '../../shared/summary-sections.js';

function SummaryDetails(inputs, outputs, price) {
    return html`
    <div class="summary__body">
        ${ Object.keys(inputs).find(key => keyInputs.includes(key)) ? html`
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

function SummaryPreview(inputs, price) {
    return html`
        <b class="large summary__preview-price">
            ${ PriceDisplay(price || { currencyCode: 'gbp' }) }
        </b>

        ${ Object.keys(inputs).find(key => keyInputs.includes(key)) ? html`
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

function ToggableWrapper(isExpanded, template) {
    const classes = {
        'summary__header': true,
        'summary__header--toggable': true,
        'summary__header--toggled-down': isExpanded,
        'summary__header--toggled-up': !isExpanded
    };
    return html`
        <header
            class="${ classMap(classes) }"
            @click=${ () => window.dispatchEvent(toggleSummary) }>
            <div class="summary__preview">${ template }</div>
        </header>`;
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


export default (inputs = {}, outputs = {}, cache = {}, _local = {}, _ = {}, isMobile, isExpanded) => {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    const price = priceObj && priceObj.price;

    if (isMobile) {

        // details are available
        if (Object.keys(inputs).find(key => keyInputs.includes(key)) || price) {
            if (isExpanded) {
                return html`
                <aside class="summary">
                    ${ ToggableWrapper(isExpanded, SummaryTitle(_)) }
                    ${ SummaryDetails(inputs, outputs, price) }
                </aside>
                <div class="summary-wrapper__overlay" @click=${ () => window.dispatchEvent(toggleSummary) }></div>`;
            }
            return html`
            <aside class="summary">
                ${ ToggableWrapper(isExpanded, SummaryPreview(inputs, price)) }
            </aside>`;

        }
        return html`
        <aside class="summary">
            <header class="summary__header">${ SummaryTitle(_) }</header>
        </aside>`;
    }

    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
        ${ SummaryDetails(inputs, outputs, price) }
    </aside>`;
};

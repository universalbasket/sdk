import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import render from '../render.js';
import { templates } from '/src/main.js';

export default {
    MobileTemplate: ({ inputs = {}, outputs = {}, cache = {}, /*local = {},*/ sdk, _ }) => {
        return render(MobileSummaryWrapper({ inputs, outputs, cache, sdk, _ }));
    },
    DesktopTemplate: ({ inputs = {}, outputs = {}, cache = {}, /*local = {},*/ sdk, _ }) => {
        return render(DesktopSummaryWrapper({ inputs, outputs, cache, sdk, _ }));
    }
};

function SummaryDetails({ outputs, inputs }) {
    const priceObj = outputs.estimatedPrice;

    return html`
    <div class="summary__body">
        <article class="summary__block">
             <ul class="dim">

        ${ dataIsProvided(inputs) ? html`
            ${ inputs.policyOptions.coverStartDate ? html`<li>Starts on: ${ inputs.policyOptions.coverStartDate }</li>` : '' }
            ${ inputs.selectedCover ? html`<li>Cover: ${ inputs.selectedCover }</li>` : '' }
            ${ inputs.selectedVetPaymentTerm ? html`<li>Vet Payment Term: ${ inputs.selectedVetPaymentTerm }</li>` : '' }
            ${ inputs.selectedPaymentTerm ? html`<li>Payment term: ${ inputs.selectedPaymentTerm }</li>` : '' }
            ${ inputs.selectedCoverType ? html`<li>${ CoverType(inputs.selectedCoverType) }</li>` : '' }
            ${ inputs.selectedVetFee ? html`<li>${ VetFee(inputs.selectedVetFee) }</li>` : '' }
            ${ inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${ inputs.selectedVoluntaryExcess.name }</li>` : '' }
            ${ inputs.selectedCoverOptions ? html`<li>Cover options: ${ inputs.selectedCoverOptions.map(_ => _.name).join(', ') }</li>` : '' }
            ` : ''}

        ${priceObj ? html`
            <li class="summary__price">
                <b class="large">
                    ${templates.priceDisplay(priceObj.price)}
                </b>
            </li>` : ''}

        ${ PetInformation(inputs) }
    </div>`;
}

function SummaryPreview({ outputs, inputs }) {
    const priceObj = outputs.estimatedPrice;

    return html`
        ${priceObj ? html`
            <b class="large summary__preview-price">
                ${templates.priceDisplay(priceObj.price)}
            </b>` : ''}
        ${ dataIsProvided(inputs) ? html`
            <span class="faint summary__preview-info">
                ${ inputs.policyOptions.coverStartDate ? html`<span>Starts on: ${ inputs.policyOptions.coverStartDate }</span>` : '' }
                ${ inputs.selectedCover ? html`<span>Cover: ${ inputs.selectedCover }</span>` : '' }
                ${ inputs.selectedVetPaymentTerm ? html`<span>Vet Payment Term: ${ inputs.selectedVetPaymentTerm }</span>` : '' }
                ${ inputs.selectedPaymentTerm ? html`<span>Payment term: ${ inputs.selectedPaymentTerm }</span>` : '' }
                ${ inputs.selectedCoverType ? html`<span>${ CoverType(inputs.selectedCoverType) }</span>` : '' }
                ${ inputs.selectedVetFee ? html`<span>${ VetFee(inputs.selectedVetFee) }</span>` : '' }
                ${ inputs.selectedVoluntaryExcess ? html`<span>Voluntary Excess: ${ inputs.selectedVoluntaryExcess.name }</span>` : '' }
                ${ inputs.selectedCoverOptions ? html`<span>Cover options: ${ inputs.selectedCoverOptions.map(_ => _.name).join(', ') }</span>` : '' }
            </span>` : ''}
    `;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Pet Insurance</span>
    `;
}

function VetFee(selectedVetFee) {
    if (!selectedVetFee) {
        return '';
    }
    return html`Vet Fee: - ${ templates.priceDisplay(selectedVetFee.price) }`;
}

function CoverType(selectedCoverType) {
    if (!selectedCoverType) {
        return '';
    }
    return html`Cover type: ${selectedCoverType.coverName}
    - ${ templates.priceDisplay(selectedCoverType.price) }`;
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
            <li>Paid/Donated: ${ templates.priceDisplay({ currencyCode, value: pets[0].petPrice })}</li>
        </ul>
    </article>`;
}

function dataIsProvided(inputs) {
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

    return !!Object.keys(inputs).find(key => keyInputs.includes(key));
}

// UI wrappers

// mobile
let isExpanded = false;
function MobileSummaryWrapper({ inputs, outputs, cache, sdk, _ }) {
    const update = new CustomEvent('update');
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (dataIsProvided(inputs) && showDetails()) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ToggableWrapper(SummaryTitle(_))}
                ${SummaryDetails({ inputs, outputs, cache, sdk })}
            </aside>
            <div class="app__summary-overlay" @click=${toggleSummary}></div>`;
        }
        return html`
        <aside class="summary">
            ${ToggableWrapper(SummaryPreview({ inputs, outputs, cache }))}
        </aside>`;
    }

    return html`
    <aside class="summary">
        <header class="summary__header">${SummaryTitle(_)}</header>
    </aside>`;


    function ToggableWrapper(template) {
        const classes = {
            'summary__header': true,
            'summary__header--toggable': true,
            'summary__header--toggled-down': isExpanded,
            'summary__header--toggled-up': !isExpanded
        };
        return html`
            <header
                class="${classMap(classes)}"
                @click=${toggleSummary}>
                <div class="summary__preview">${template}</div>
            </header>`;
    }
}

// deskop
function DesktopSummaryWrapper({ inputs, outputs, cache, sdk, _ }) {
    return html`
    <aside class="summary">
        <header class="summary__header">${SummaryTitle(_)}</header>
        ${showDetails() ? SummaryDetails({ inputs, outputs, cache, sdk }) : ''}
    </aside>`;
}

function showDetails() {
    const route = window.location.hash.slice(1);
    return !['/error', '/confirmation'].includes(route);
}

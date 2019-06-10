import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

import PriceDisplay from '../../../src/builtin-templates/price-display.js';

const toggleSummary = new CustomEvent('toggle-summary');

import {
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

function SummaryDetails(inputs, outputs, price) {
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
    <div class="summary__body">
        ${ inputs.selectedBroadbandPackage || inputs.selectedPhonePackage || selectedTvPackages ?
        html`
            <article class="summary__block">
                <header class="summary__block-title">
                    Your Room
                </header>
                <ul class="dim">
                    ${ inputs.selectedBroadbandPackage ? html`<li>Broadband: ${ inputs.selectedBroadbandPackage.name }</li>` : '' }
                    ${ selectedTvPackages ? html`<li>TV: ${ selectedTvPackages }</li>` : '' }
                    ${ inputs.selectedPhonePackage ? html`<li>Phone: ${ inputs.selectedPhonePackage.name }</li>` : '' }
                </ul>
            </article>` :
        '' }

        ${ price ?
        html`
            <div class="summary__block summary__block--price">
                <b class="large highlight">
                    ${ PriceDisplay(price) }
                </b>
            </div>` :
        '' }

        ${ Documents(outputs) }
        ${ OtherInformation(outputs) }
    </div>`;
}

function SummaryPreview(inputs, price) {
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
        <b class="large summary__preview-price">
            ${ PriceDisplay(price || { currencyCode: 'gbp' }) }
        </b>

        ${ inputs.selectedBroadbandPackage || inputs.selectedPhonePackage || selectedTvPackages ? html`
            <span class="faint summary__preview-info">
                ${ inputs.selectedBroadbandPackage ? html`<span>Broadband: ${ inputs.selectedBroadbandPackage.name }</span>` : '' }
                ${ selectedTvPackages ? html`<span>TV: ${ selectedTvPackages }</span>` : '' }
                ${ inputs.selectedPhonePackage ? html`<span>Phone: ${ inputs.selectedPhonePackage.name }</span>` : '' }
            </span>` :
        '' }`;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Hotel Booking</span>
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

export default (inputs = {}, outputs = {}, cache = {}, _local = {}, _ = {}, isMobile, isExpanded) => {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    const price = priceObj && priceObj.price;

    if (isMobile) {

        if (inputs.selectedRooms && inputs.selectedRooms[0] || price) {
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


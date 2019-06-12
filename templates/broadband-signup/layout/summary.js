import { html } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from '../../../src/builtin-templates/price-display.js';

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
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
    <div class="summary__body">
        ${ hasContent(inputs) ?
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

function SummaryPreview(inputs, outputs, cache) {
    const price = getPrice(outputs, cache);
    const selectedTvPackages = inputs.selectedTvPackages && inputs.selectedTvPackages.map(_ => _.name).join(', ');

    return html`
        <b class="large summary__preview-price">
            ${ PriceDisplay(price || { currencyCode: 'gbp' }) }
        </b>

        ${ hasContent(inputs) ? html`
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

function getPrice(outputs, cache) {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    return priceObj && priceObj.price;
}

function hasContent(inputs) {
    return !!(inputs.selectedBroadbandPackage ||
        inputs.selectedPhonePackage ||
        inputs.selectedTvPackages && inputs.selectedTvPackages.length > 0);
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


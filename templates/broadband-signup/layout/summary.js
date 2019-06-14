import { html, templates } from '/src/main.js';

import {
    OtherInformation,
    MobileSummaryWrapper,
    DesktopSummaryWrapper,
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
                    ${ templates.PriceDisplay(price) }
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
            ${ templates.PriceDisplay(price || { currencyCode: 'gbp' }) }
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
        <span class="faint large">Broadband signup</span>
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
    return DesktopSummaryWrapper(inputs, outputs, cache, _, SummaryTitle, SummaryDetails);
}

function MobileTemplate(inputs, outputs, cache, _) {
    return MobileSummaryWrapper(inputs, outputs, cache, _,
        SummaryPreview, SummaryTitle, SummaryDetails, hasContent);
}


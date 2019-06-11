import { html } from '/web_modules/lit-html/lit-html.js';
import { templates } from '/web_modules/@ubio/sdk-application-bundle.js';

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
        ${ hasContent(inputs) ?
        html`
            <article class="summary__block">
                <header class="summary__block-title">
                    Your Room
                </header>
                <ul class="dim">
                    ${ inputs.selectedRooms[0].type ? html`<li>${ inputs.selectedRooms[0].type }</li>` : '' }
                    ${ inputs.selectedRooms[0].price ? html`<li>${ templates.priceDisplay(inputs.selectedRooms[0].price) }</li>` : '' }
                </ul>
            </article>` :
        '' }

        ${ price ? html`
            <div class="summary__block summary__block--price">
                <b class="large highlight">
                    ${ templates.priceDisplay(price) }
                </b>
            </div>` :
        '' }

        ${ Documents(outputs) }
        ${ OtherInformation(outputs) }
    </div>`;
}

function SummaryPreview(inputs, outputs, cache) {
    const price = getPrice(outputs, cache);

    return html`
        <b class="large summary__preview-price">
            ${ templates.priceDisplay(price || { currencyCode: 'gbp' }) }
        </b>

        ${ hasContent(inputs) ? html`
            <span class="faint summary__preview-info">
                ${ inputs.selectedRooms[0].type ? html`<span>${ inputs.selectedRooms[0].type }</span>` : '' }
                ${ inputs.selectedRooms[0].price ? html`<span>${ templates.priceDisplay(inputs.selectedRooms[0].price) }</span>` : '' }
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
    return !!inputs.selectedRooms && inputs.selectedRooms[0];
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

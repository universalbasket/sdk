import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

import PriceDisplay from './price-display.js';

const toggleSummary = new CustomEvent('toggle-summary');

function getView({
    isExpanded,
    isMobile,
    inputs = {},
    outputs = {},
    cache = {},
    local = {},
    _ = {}
}) {
    const serviceName = _.serviceName || 'Your package';
    const domain = 'domain placeholder';
    if (isMobile) {
        return html`
            ${ SummaryMobile({ isExpanded, inputs, outputs, cache, local, serviceName, domain }) }
            ${ isExpanded ? html`
                <div
                    class="summary-wrapper__overlay"
                    @click=${ () => window.dispatchEvent(toggleSummary) }></div>` : ''}`;
    }
    return SummaryDesktop({ serviceName, domain });
}

export default getView;

function SummaryBodyTemplate() {
    return html`<section class="summary__body" id="summary-body"></section>`;
}

function SummaryHeaderInitial(serviceName, domain) {
    return html`
        <b class="large">${serviceName || 'Your Package'}</b>
        <span class="faint large">${domain}</span>`;
}

function SummaryHeaderPartial({ inputs, outputs, cache, local }) {
    const priceObj = outputs.finalPrice ||
        outputs.estimatedPrice ||
        cache.finalPrice ||
        cache.estimatedPrice;

    const price = priceObj && priceObj.price || { currencyCode: local.currencyCode || 'gbp' };

    return html`
        <b class="large summary__preview-price">
            ${PriceDisplay(price)}
        </b>
        <span class="faint summary__preview-info">
            ${getSummaryPreviewInfo({ inputs })}
        </span>`;
}

function ToggableHeaderWrapper(isExpanded, template) {
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
            <div class="summary__preview">${template}</div>
        </header>`;
}

function StaticHeaderWrapper(template) {
    return html`<header class="summary__header">${template}</header>`;
}

function SummaryDesktop({ serviceName, domain }) {
    return html`<div class="summary">
        ${SummaryHeaderInitial(serviceName, domain)}
        ${SummaryBodyTemplate()}
    </div>`;
}

function SummaryMobile({ isExpanded, inputs, outputs, serviceName, domain, cache, local }) {
    let contents;
    if (inputs || outputs || cache) {
        contents = html`
        ${ isExpanded ? html`
            ${ ToggableHeaderWrapper(isExpanded, SummaryHeaderInitial(serviceName, domain)) }
            ${ SummaryBodyTemplate() }` :
        ToggableHeaderWrapper(isExpanded, SummaryHeaderPartial({ inputs, outputs, cache, local })) }`;
    } else {
        contents = StaticHeaderWrapper(SummaryHeaderInitial(serviceName, domain));
    }
    return html`<div class="summary">${ contents }</div>`;
}

function getSummaryPreviewInfo({ inputs }) {
    // TODO re-implement using domain knowledge

    // Broadband
    const items = Object.values(inputs)
        .filter(i => i.name)
        .map(i => i.name)
        .join(', ');

    if (items.length > 0) {
        return items.join(', ');
    }

    // Pet
    if (inputs.policyOptions && inputs.policyOptions.coverStartDate) {
        items.push(inputs.policyOptions.coverStartDate);
    }
    if (inputs.selectedCover) {
        items.push(inputs.selectedCover);
    }
    if (items.length > 0) {
        return items.join(', ');
    }

    // Hotel
    if (inputs.selectedRooms && inputs.selectedRooms[0]) {
        return html`
            ${ inputs.selectedRooms[0].type }
            –
            ${ PriceDisplay(inputs.selectedRooms[0].price) }`;
    }

    return '';
}


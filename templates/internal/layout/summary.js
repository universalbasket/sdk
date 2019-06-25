import { html } from '/src/main.js';

import {
    MobileSummaryWrapper,
    DesktopSummaryWrapper
} from '../../shared/summary.js';

export default {
    MobileTemplate,
    DesktopTemplate
};

function hasData() {
    return false;
}

function SummaryDetails() {
    return html`<div class="summary__body"></div>`;
}

function SummaryPreview() {
    return '';
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Internal</span>
    `;
}

function DesktopTemplate(inputs, outputs, cache, _local, _) {
    return DesktopSummaryWrapper(inputs, outputs, cache, _, SummaryTitle, SummaryDetails);
}

function MobileTemplate(inputs, outputs, cache, _local, _) {
    return MobileSummaryWrapper(inputs, outputs, cache, _,
        SummaryPreview, SummaryTitle, SummaryDetails, hasData);
}

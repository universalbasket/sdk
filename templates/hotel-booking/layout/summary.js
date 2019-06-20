import { html, templates } from '/src/main.js';

import {
    MobileSummaryWrapper,
    DesktopSummaryWrapper
} from '../../shared/summary.js';

export default {
    MobileTemplate,
    DesktopTemplate
};

function hasData(inputs) {
    return inputs.selectedRooms && inputs.selectedRooms[0];
}

function SummaryDetails(inputs, outputs) {
    return html`
    <div class="summary__body">
        ${ hasData(inputs) ? html`
            <article class="summary__block">
                <header class="summary__block-title">
                    ${ inputs.selectedRooms[0].type }
                </header>
                <ul class="dim">
                    ${ inputs.selectedRooms[0].valueAdditions.map(i => html`<li>${ valueLabel(i) }</li>`) }
                    <li class="summary__price">
                        <b class="large">
                            ${ templates.priceDisplay(inputs.selectedRooms[0].price) }
                        </b>
                    </li>
                </ul>
            </article>` :
        '' }

        ${ outputs.priceBreakdown ? html`
            <article class="summary__block">
                <header class="summary__block-title">
                    Price Breakdown
                </header>
                <table class="table">
                    ${ outputs.priceBreakdown.map(i => html`
                        <tr>
                            <th>${ i.description } ${ i.type ? '· ' + templates.priceType(i.type) : '' }</th>
                            <td>${ templates.priceDisplay(i.price) }</td>
                        </tr>`) }
                </table>
            </article>` :
        '' }
    </div>`;
}

function SummaryPreview(inputs) {
    return hasData(inputs) ?
        html`
            <b class="large summary__preview-price">
                ${ templates.priceDisplay(inputs.selectedRooms[0].price) }
            </b>
            <span class="faint summary__preview-info">
                ${ [inputs.selectedRooms[0].type, ...inputs.selectedRooms[0].valueAdditions.map(valueLabel)].join(', ') }
            </span>` :
        '';
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Hotel Booking</span>
    `;
}

function valueLabel(code) {
    switch (code) {
        case 'pay-later': return 'Pay later';
        case 'free-breakfast': return 'Breakfast included';
        case 'free-internet': return 'Wi-fi';
        default: return code;
    }
}

function DesktopTemplate(inputs, outputs, cache, _local, _) {
    return DesktopSummaryWrapper(inputs, outputs, cache, _, SummaryTitle, SummaryDetails);
}

function MobileTemplate(inputs, outputs, cache, _local, _) {
    return MobileSummaryWrapper(inputs, outputs, cache, _,
        SummaryPreview, SummaryTitle, SummaryDetails, hasData);
}

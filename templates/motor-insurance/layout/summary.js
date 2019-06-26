import { html, until, classMap, templates } from '/src/main.js';

export default {
    MobileTemplate: (inputs = {}, outputs = {}, cache = {}, _local = {}, _) => {
        return MobileSummaryWrapper(inputs, outputs, cache, _);
    },
    DesktopTemplate: (inputs = {}, outputs = {}, cache = {}, _local = {}, _) => {
        return DesktopSummaryWrapper(inputs, outputs, cache, _);
    }
};

function SummaryDetails({ outputs }) {
    const { make, model, yearOfManufacture, yearOfRegistration, registrationNumber } = outputs.vehicleDetails || {};
    const priceObj = outputs.estimatedPrice;

    return html`
    <div class="summary__body">
        <article class="summary__block">
            <header class="summary__block-title">
                Vehicle details
            </header>
            <ul class="dim">
            ${ outputs.coverSummary ? html`` : '' }

            ${ outputs.vehicleDetails ? html`
                ${ make ? html`<li>Make: ${ make }</li>` : '' }
                ${ model ? html`<li>Model: ${ model }</li>` : '' }
                ${ yearOfManufacture ? html`<li>Year of manufacture: ${ yearOfManufacture }</li>` : '' }
                ${ yearOfRegistration ? html`<li>Year of registration: ${ yearOfRegistration }</li>` : '' }
                ${ registrationNumber ? html`<li>Registration number: ${ registrationNumber }</li>` : '' }
                ` : '' }
            ${ priceObj ? html`
                <li class="summary__price">
                    <b class="large">
                        ${ templates.priceDisplay(priceObj.price) } today
                        then £70.38 per month
                    </b>
                </li>` : '' }
            </ul>
        </article>

        ${ outputs.priceBreakdown ? html`
            <h4>${ outputs.priceBreakdown.name }</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${ outputs.priceBreakdown.contents.map(o => html`
                        <tr>
                            <th>${ o.name }</th>
                            <td>${ o.text }</td>
                        </tr>`) }
                </table>
            </article>` : '' }

        ${ outputs.excessBreakdown ? html`
            <h4>
                ${ outputs.excessInfo ? html`
                    <span
                        class="summary__popup-icon"
                        @click=${ () => templates.modal(outputs.excessInfo, { title: outputs.excessBreakdown.name }).show() }>
                        <span class="clickable">${ outputs.excessBreakdown.name }</span>
                    </span>` : '' }
            </h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${ outputs.excessBreakdown.contents.map(o => html`
                        <tr>
                            <th>${ o.name }</th>
                            <td>${ o.text }</td>
                        </tr>`) }
                </table>
            </article>` : '' }

        ${ outputs.financialPromotionRepresentativeExample ? html`
            <h4>${ outputs.financialPromotionRepresentativeExample.name }</h4>
            <article class="summary__block summary__block--bordered">

                <table class="table">
                    ${ outputs.financialPromotionRepresentativeExample.contents.map(o => html`
                        <tr>
                            <th>${ o.name }</th>
                            <td>${ o.text }</td>
                        </tr>`) }
                </table>
            </article>` : '' }

        ${ outputs.policyWording || outputs.productInformation || outputs.privacyPolicy ? html`
            <div class="summary__block summary__block--bordered">
                <h4>Documents</h4>
                <ul class="dim">
                    ${ outputs.policyWording ? doc(outputs.policyWording) : '' }
                    ${ outputs.productInformation ? doc(outputs.productInformation) : '' }
                    ${ outputs.privacyPolicy ? doc(outputs.privacyPolicy) : '' }
                </ul>
            </div>` : '' }
    </div>`;
}

function SummaryPreview({ outputs }) {
    const { make, model, yearOfRegistration, registrationNumber } = outputs.vehicleDetails || {};
    const priceObj = outputs.estimatedPrice;

    return html`
        ${ priceObj ? html`
            <b class="large summary__preview-price">
                ${ templates.priceDisplay(priceObj.price) } today
                then £70.38 per month
            </b>` : '' }
        ${ outputs.vehicleDetails ? html`
            <span class="faint summary__preview-info">
                ${ make ? html`<span>Make: ${ make }</span>` : '' }
                ${ model ? html`<span>Model: ${ model }</span>` : '' }
                ${ yearOfRegistration ? html`<span>Year: ${ yearOfRegistration }</span>` : '' }
                ${ registrationNumber ? html`<span>Reg: ${ registrationNumber }</span>` : '' }
            </span>` : '' }
    `;
}

function SummaryTitle(_) {
    const title = _.serviceName || 'Your Package';
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Motor Insurance</span>
    `;
}

function doc(item) {
    const link = item.contents && item.contents.find(i => i.type === 'Link');
    return html`<li>${ until(templates.file(link)) }</li>`;
}

// UI wrappers

// mobile
let isExpanded = false;
function MobileSummaryWrapper(inputs, outputs, cache, _) {
    const update = new CustomEvent('update');
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (hasContent() && showDetails()) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ ToggableWrapper(SummaryTitle(_)) }
                ${ SummaryDetails({ inputs, outputs, cache }) }
            </aside>
            <div class="app__summary-overlay" @click=${ toggleSummary }></div>`;
        }
        return html`
        <aside class="summary">
            ${ ToggableWrapper(SummaryPreview({ inputs, outputs, cache })) }
        </aside>`;
    }

    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
    </aside>`;

    function hasContent() {
        return outputs.vehicleDetails || outputs.estimatedPrice;
    }

    function ToggableWrapper(template) {
        const classes = {
            'summary__header': true,
            'summary__header--toggable': true,
            'summary__header--toggled-down': isExpanded,
            'summary__header--toggled-up': !isExpanded
        };
        return html`
            <header
                class="${ classMap(classes) }"
                @click=${ toggleSummary }>
                <div class="summary__preview">${ template }</div>
            </header>`;
    }
}

// deskop
function DesktopSummaryWrapper(inputs, outputs, cache, _) {
    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
        ${ showDetails() ? SummaryDetails({ inputs, outputs, cache }) : '' }
    </aside>`;
}

function showDetails() {
    const route = window.location.hash.slice(1);
    return !['/error', '/confirmation'].includes(route);
}

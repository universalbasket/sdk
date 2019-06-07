import { html } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from './price-display.js'

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
    const serviceName = _.serviceName;
    const domain = 'domain placeholder';
    if (isMobile) {
        return html`
            ${ SummaryMobile({ isExpanded, inputs, outputs, cache, local, serviceName, domain }) }
            ${ isExpanded ?
                html`
                    <div
                        class="summary-wrapper__overlay"
                        @click=${ () => window.dispatchEvent(toggleSummary) }></div>` :
                ''
            }`;
    }
    return SummaryDesktop({ serviceName, domain });
}

export default getView;

const SummaryBodyTemplate = () => html`
    <section class="summary__body" id="summary-body"></section>`

const SummaryHeaderInitial = (serviceName, domain) => html`
    <b class="large">${serviceName || 'Your Package'}</b>
    <span class="faint large">${domain}</span>
`

const SummaryHeaderPartial = ({ inputs, outputs, cache }) => html`
    <b class="large summary__preview-price">
        ${cache.finalPrice ? PriceDisplay(cache.finalPrice.price) : ''}
    </b>
    <span class="faint summary__preview-info">
        ${Object.values(inputs)
            .filter(i => i.name)
            .map(i => i.name)
            .join(', ')}
    </span>
`

const ToggableHeaderWrapper = (isExpanded, template) => html`
    <header class="summary__header summary__header--toggable ${isExpanded ?
        'summary__header--toggled-down' :
        'summary__header--toggled-up'}"
        @click=${ () => window.dispatchEvent(toggleSummary) }>
        <div class="summary__preview">${template}</div>
    </header>
`

const StaticHeaderWrapper = (template) => html`
    <header class="summary__header">${template}</header>
`

const SummaryDesktop = ({ serviceName, domain, cache }) =>html`
    <div class="summary">
        ${SummaryHeaderInitial(serviceName, domain)}
        ${SummaryBodyTemplate()}
    </div>
`

const SummaryMobile = ({ isExpanded, inputs, outputs, serviceName, domain, cache }) =>
    (inputs || outputs) ?
        html`
            <div class="summary">
                ${isExpanded ?
                    html`
                        ${ToggableHeaderWrapper(isExpanded, SummaryHeaderInitial(serviceName, domain))}
                        ${SummaryBodyTemplate()}
                    ` :
                    ToggableHeaderWrapper(isExpanded, SummaryHeaderPartial({ inputs, outputs, cache }))
                }
            </div>` :
        html`<div class="summary">
            ${StaticHeaderWrapper(SummaryHeaderInitial(serviceName, domain))}
        </div>`



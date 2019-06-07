import { html } from '/web_modules/lit-html/lit-html.js';
import PriceDisplay from './price-display.js'

const toggleSummary = new CustomEvent('toggle-summary');

export default ({
    isExpanded,
    isMobile,
    serviceName,
    domain,
    inputs = {},
    outputs = {},
    cache = {},
    local = {}
}) =>
    isMobile ?
        html`
            ${SummaryMobile({ isExpanded, serviceName, domain, inputs, outputs, cache, local })}
            ${ isExpanded ?
                html`<div
                    class="summary-wrapper__overlay"
                    @click=${ () => window.dispatchEvent(toggleSummary) }></div>` :
                ''}`:
        SummaryDesktop({ serviceName, domain });

const SummaryBodyTemplate = () => html`
    <section class="summary__body" id="summary-body"></section>`

const SummaryHeaderInitial = (serviceName, domain) => html`
    <b class="large">${serviceName || 'Your Package'}</b>
    ${ console.info(domain)}
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



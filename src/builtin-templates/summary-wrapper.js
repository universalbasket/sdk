import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';

const toggleSummary = new CustomEvent('toggle-summary');

export default ({
    isExpanded,
    isMobile,
    inputs,
    outputs,
    cache,
    local,
    serviceName,
    domain
}) =>
    isMobile ?
        html`
            ${SummaryMobile({ isExpanded, inputs, outputs, serviceName, domain })}
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
    <span class="faint large">${domain}</span>
`

const SummaryHeaderPartial = ({ inputs, outputs }) => html`
    <b class="large summary__preview-price">£14.99</b>
    <span class="faint summary__preview-info">
        ${Object.values(outputs).slice(4).join(', ')}
        Starts 11/06/2019, Accidents only, 10% Vet fee
    </span>
`

const ToggableHeaderWrapper = (isExpanded, template) => html`
    <header class=${classMap({
            'summary__header': true,
            'summary__header--toggable': true,
            'summary__header--toggled-up': !isExpanded,
            'summary__header--toggled-down': isExpanded
        })}
        @click=${ () => window.dispatchEvent(toggleSummary) }>
        <div class="summary__preview">${template}</div>
    </header>
`

const StaticHeaderWrapper = (template) => html`
    <header class="summary__header">${template}</header>
`

const SummaryDesktop = ({ serviceName, domain }) =>html`
    <div class="summary">
        ${SummaryHeaderInitial(serviceName, domain)}
        ${SummaryBodyTemplate()}
    </div>
`

const SummaryMobile = ({ isExpanded, inputs, outputs, serviceName, domain }) =>
    (inputs || outputs) ?
        html`
            <div class="summary">
                ${isExpanded ?
                    html`
                        ${ToggableHeaderWrapper(isExpanded, SummaryHeaderInitial(serviceName, domain))}
                        ${SummaryBodyTemplate()}
                    ` :
                    ToggableHeaderWrapper(isExpanded, SummaryHeaderPartial({ inputs, outputs }))
                }
            </div>` :
        html`<div class="summary">
            ${StaticHeaderWrapper(SummaryHeaderInitial(serviceName, domain))}
        </div>`



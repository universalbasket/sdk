import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

const toggleEvent = new CustomEvent('toggle');

export default ({
    isExpanded,
    isMobile,
    inputs,
    outputs,
    cache,
    local,
    serviceName = 'Your Package',
    domain = ''
}) =>
    isMobile ?
        html`
            ${SummaryMobile({ isExpanded, inputs, outputs, serviceName, domain })}
            ${ isExpanded ? html`<div class="summary-wrapper__overlay"></div>` : ''}`:
        SummaryDesktop({ serviceName, domain });

const SummaryBodyTemplate = () => html`
    <section class="summary__body" id="summary-body"></section>`

const SummaryHeaderInitial = (serviceName, domain) => html`
    <div class="summary__header">
        <b>${serviceName}</b>
        <span class="dimmed">${domain}</span>
    </div>
`

const SummaryHeaderPartial = ({ inputs, outputs }) => html`
    <b class="highlight">£14.99</b> a summary
`

const SummaryDesktop = ({ serviceName, domain }) =>html`
    <div class="summary"
        ${SummaryHeaderInitial(serviceName, domain)}
        ${SummaryBodyTemplate()}
    </div>
`

const ToggableWrapper = (isExpanded, template) => html`
    <div class="toggable"
        class=${classMap({
            'toggable-up': isExpanded,
            'toggable-down': !isExpanded
        })}
        @click=${ () => window.dispatchEvent(toggleEvent) }>
        ${template}
    </div>
`

const SummaryMobile = ({ isExpanded, inputs, outputs, serviceName, domain }) =>
    (inputs || outputs) ?
        html`
            <div class="summary">
                ${isExpanded ?
                    html`
                        ${ToggableWrapper(isExpanded, SummaryHeaderInitial(serviceName, domain))}
                        ${SummaryBodyTemplate()}
                    ` :
                    ToggableWrapper(isExpanded, SummaryHeaderPartial({ inputs, outputs }))
                }
            </div>` :
        html`<div class="summary">
            ${SummaryHeaderInitial(serviceName, domain)}
        </div>`



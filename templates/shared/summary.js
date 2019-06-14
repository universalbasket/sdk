import { html, classMap, templates } from '/src/main.js';

const showModal = (...detail) => new CustomEvent('show-modal', { detail });
const update = new CustomEvent('update');

export {
    OtherInformation,
    Documents,
    MobileSummaryWrapper,
    DesktopSummaryWrapper
};

let isExpanded = false;

function showDetails() {
    const route = window.location.hash.slice(1);
    return !['/error', '/confirmation'].includes(route);
}

function DesktopSummaryWrapper(inputs, outputs, cache, _, SummaryTitle, SummaryDetails) {
    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
        ${ showDetails() ? SummaryDetails(inputs, outputs, cache) : '' }
    </aside>`;
}

function MobileSummaryWrapper(inputs, outputs, cache, _, SummaryPreview, SummaryTitle, SummaryDetails, hasContent) {
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (hasContent(inputs) && showDetails()) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ ToggableWrapper(SummaryTitle(_)) }
                ${ SummaryDetails(inputs, outputs, cache) }
            </aside>
            <div class="app__summary-overlay" @click=${ toggleSummary }></div>`;
        }
        return html`
        <aside class="summary">
            ${ ToggableWrapper(SummaryPreview(inputs, outputs, cache)) }
        </aside>`;
    }

    return html`
    <aside class="summary">
        <header class="summary__header">${ SummaryTitle(_) }</header>
    </aside>`;

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

function OtherInformation(outputs = {}) {
    const items = Object.values(outputs)
        .filter(o => ['StructuredText', 'HTML'].includes(o.type))
        .map(o => html`
            <li>
                <span
                    class="summary__popup-icon"
                    @click=${() => window.dispatchEvent(showModal(o))}>
                    <span class="clickable">${o.name}</span>
                </span>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--bordered">
            <h4>Other information</h4>
            <ul class="dim">${ items }</ul>
        </div>`;
}


function Documents(outputs = {}) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'File')
        .map(o => html`
            <li class="summary__file-icon">
                ${ templates.file(o) }
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--bordered">
            <h4>Documents</h4>
            <ul class="dim">${ items }</ul>
        </div>`;

}

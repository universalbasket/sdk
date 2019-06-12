import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';

const showModal = (...detail) => new CustomEvent('show-modal', { detail });
const update = new CustomEvent('update');

export {
    OtherInformation,
    Documents,
    MobileSummaryWrapper
};

let isExpanded = false;

function MobileSummaryWrapper(inputs, outputs, cache, _, SummaryPreview, SummaryTitle, SummaryDetails, hasContent) {
    const toggleSummary = {
        handleEvent() {
            isExpanded = !isExpanded;
            window.dispatchEvent(update);
        },
        capture: true
    };

    if (hasContent(inputs)) {
        if (isExpanded) {
            return html`
            <aside class="summary">
                ${ ToggableWrapper(SummaryTitle(_)) }
                ${ SummaryDetails(inputs, outputs, cache) }
            </aside>
            <div class="sticky-top__overlay" @click=${ toggleSummary }></div>`;
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
                    class="popup-icon"
                    @click=${() => window.dispatchEvent(showModal(o))}>
                    <span class="clickable">${o.name}</span>
                </span>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Other information</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;
}

function Documents(outputs = {}) {
    const items = Object.values(outputs)
        .filter(o => o.type === 'File')
        .map(o => html`
            <li class="file-icon">
                <a href="${o.url}" target="_blank">${o.filename}</a>
            </li>`);

    if (items.length === 0) {
        return '';
    }

    return html`
        <div class="summary__block summary__block--docs">
            <p><b>Documents</b></p>
            <ul class="dim">${ items }</ul>
        </div>`;

}

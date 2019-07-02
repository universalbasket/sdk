import { html } from '/src/main.js';

export default {
    MobileTemplate: (_inputs = {}, _outputs = {}, _cache = {}, _local = {}, _) => {
        return SummaryTitle(_);
    },
    DesktopTemplate: (_inputs = {}, _outputs = {}, _cache = {}, _local = {}, _) => {
        return SummaryTitle(_);
    }
};

function SummaryTitle(_) {
    const title = _.serviceName;
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Internal</span>
    `;
}

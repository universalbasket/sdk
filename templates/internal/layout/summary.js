import { html } from '/src/main.js';

export default {
    MobileTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
        return html`
        <aside class="summary">
            <header class="summary__header">${SummaryTitle(_)}</header>
        </aside>`;
    },
    DesktopTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
        return html`
        <aside class="summary">
            <header class="summary__header">${SummaryTitle(_)}</header>
        </aside>`;
    }
};

function SummaryTitle(_) {
    const title = _.serviceName;
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Internal</span>
    `;
}

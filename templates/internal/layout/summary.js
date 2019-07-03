import { html } from '/src/main.js';

export default {
    MobileTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
        return SummaryTitle(_);
    },
    DesktopTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
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

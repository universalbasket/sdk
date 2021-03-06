import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';

export default {
    MobileTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
        return render(html`
            <aside class="summary">
                <header class="summary__header">${SummaryTitle(_)}</header>
            </aside>
        `);
    },
    DesktopTemplate: ({ /*inputs = {}, outputs = {}, cache = {}, local = {}, sdk,*/ _ }) => {
        return render(html`
            <aside class="summary">
                <header class="summary__header">${SummaryTitle(_)}</header>
            </aside>
        `);
    }
};

function SummaryTitle(_) {
    const title = _.serviceName;
    return html`
        <b class="large">${ title }</b>
        <span class="faint large">Internal</span>
    `;
}

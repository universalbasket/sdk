import { html } from '/src/main.js';

export default (name, { coverSummary }) => {
    return html`
        <h2>${ coverSummary.name }</h2>

        ${ coverSummary.contents.map(part => html`
            <h3>${ part.name }</h3>
            <table class="table">
            ${ part.contents.map(part => html`
                <tr>
                    <th>${ part.name }</th>
                    <td>${ part.text }</td>
                </tr>
            </table>`) }
        `) }

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

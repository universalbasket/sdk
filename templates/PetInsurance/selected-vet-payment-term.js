import { html } from 'lit-html';

const key = 'selected-vet-payment-term';

export default (output) => {
    return html`
    <div class="field field-set">
        <span class="field__name">Select Vet Payment Term </span>
        <select name="${key}">
            ${ output.map(o => html`<option value="${o}"> ${o}</option>`
            )}
        </select>
    </div>
`};

import kebabCase from 'lodash.kebabcase';
import { html } from '../../src/lit-html';

export default (meta, priceConsent) => {
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <input type="radio" name="${kebabCase(meta.key)}-$object" value="${JSON.stringify(priceConsent)}" required>
        <b>${ priceConsent.value } ${ priceConsent.currencyCode }</b>
    </div>
`};

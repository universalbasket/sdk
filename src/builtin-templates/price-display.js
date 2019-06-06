import { html } from '/web_modules/lit-html/lit-html.js';
import getSymbolFromCurrency from '/web_modules/currency-symbol-map.js'

const template = (price) => {
    if (!price) {
        return html`&middot;`
    }
    const {value, currencyCode} = price;
    return value === 0 ?
        html`FREE` :
        html`${getSymbolFromCurrency(currencyCode.toUpperCase())}${value}`
}

export default template

import { html } from '/web_modules/lit-html/lit-html.js';
import getSymbolFromCurrency from '/web_modules/currency-symbol-map.js'

const template = (price) => {
    if (!price) {
        return '';
    }

    const currencySymbol = getSymbolFromCurrency(price.currencyCode);

    if (currencySymbol && typeof price.value === 'undefined') {
        return html`${currencySymbol}&middot;`
    }

    if (isNaN(Number(price.value))) {
        return '';
    }

    const value = (price.value * 0.01).toFixed(2);

    return price.value === 0 ?
        html`FREE` :
        currencySymbol ?
            html`${currencySymbol}${value}` :
            html`${value}${price.currencyCode}`

}

export default template

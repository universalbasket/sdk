import getSymbolFromCurrency from '/web_modules/currency-symbol-map.js';

function template(price) {
    if (!price) {
        return document.createTextNode('');
    }

    const currencySymbol = getSymbolFromCurrency(price.currencyCode);

    if (currencySymbol && typeof price.value === 'undefined') {
        return document.createTextNode(`${currencySymbol} &middot;`);
    }

    if (isNaN(Number(price.value))) {
        return document.createTextNode('');
    }

    const value = (price.value * 0.01).toFixed(2);

    if (price.value === 0) {
        return document.createTextNode('FREE');
    }

    return document.createTextNode(currencySymbol ? `${currencySymbol}${value}` : `${value}${price.currencyCode}`);
}

export default template;

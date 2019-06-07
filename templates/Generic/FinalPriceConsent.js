import { html } from '/web_modules/lit-html/lit-html.js';

export default finalPrice => {
    const { value, currencyCode } = finalPrice && finalPrice.price || {};
    let displayValue = value || 0;

    if (!isNaN(Number(value))) {
        displayValue = (value * 0.01).toFixed(2);
    }

    return html`
        <div>
            <h4>Price check</h4>
            <p>The final price has changed and will be:</p>
            ${displayValue}
            ${currencyCode}
            <input
                type="hidden"
                name="final-price-consent-$object"
                value="${JSON.stringify(finalPrice)}"/>
        </div>`;
};

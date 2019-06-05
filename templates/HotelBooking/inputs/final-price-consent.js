import { html } from 'lit-html';

export default (finalPrice) => {
    return html`
        <div>
            <h4>Price check</h4>
            <p>The final price has changed and will be:</p>
            ${finalPrice.price.value/100} ${finalPrice.price.currencyCode.toUpperCase()}

            <input type="hidden" name="final-price-consent-$object" value="${JSON.stringify(finalPrice)}"/>
        </div>
`};

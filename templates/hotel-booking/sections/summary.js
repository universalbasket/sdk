import { html, templates } from '/src/main.js';

export default (name, { selectedRooms, priceBreakdown }) => {
    return html`
        <h2>Summary</h2>

        <h3>Your room</h3>
        <table class="table">
            <tr>
                <th>Type</th>
                <td>${ selectedRooms[0].type }</td>
            </tr>
            <tr>
                <th>Price</th>
                <td>${ templates.priceDisplay(selectedRooms[0].price) }</td>
            </tr>
        </table>

        <h3>Price Breakdown</h3>
        <table class="table">
            ${ priceBreakdown.map(i => html`
                <tr>
                    <th>${ i.description } ${ i.type ? '· ' + templates.priceType(i.type) : '' }</th>
                    <td>${ templates.priceDisplay(i.price) }</td>
                </tr>`) }
        </table>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

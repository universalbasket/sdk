import { html } from '/web_modules/lit-html/lit-html.js';

//get service name & domain
export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${inputs.selectedRooms ?
        html`
        <div id="selected-room" class="summary__block">
            <h5 class="summary__block-title"> Your Room </h5>
            <ul>
                <li>${inputs.selectedRooms[0].type}</li>
                <li>${inputs.selectedRooms[0].price.value/100} ${inputs.selectedRooms[0].price.currencyCode.toUpperCase()}</li>
            </ul>
        </div>` : ''}
</div>`;

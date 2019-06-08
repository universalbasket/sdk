import { html } from '/web_modules/lit-html/lit-html.js';

import PriceDisplay from '../../../../src/builtin-templates/price-display.js';

import {
    PriceInformation,
    OtherInformation,
    Documents
} from '../../shared/summary-sections.js';

export default (inputs = {}, outputs = {}, cache = {}, _local = {}) => {
    return html`
        ${inputs.selectedRooms && inputs.selectedRooms[0] ?
        html`
            <article class="summary__block">
                <header class="summary__block-title">
                    Your Room
                </header>
                <ul class="dim">
                    <li>${inputs.selectedRooms[0].type}</li>
                    <li>${PriceDisplay(inputs.selectedRooms[0].price)}</li>
                </ul>
            </article>` : ''}

        ${PriceInformation({ cache, outputs })}
        ${Documents({ outputs })}
        ${OtherInformation({ outputs })}`;
};

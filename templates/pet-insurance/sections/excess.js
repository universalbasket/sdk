import { html } from '/src/main.js';
import { selectedVoluntaryExcess } from '../inputs/index.js';

export default (name, { availableVoluntaryExcesses }) => html`
    ${selectedVoluntaryExcess(availableVoluntaryExcesses)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Find Cover</button>
    </div>
`;

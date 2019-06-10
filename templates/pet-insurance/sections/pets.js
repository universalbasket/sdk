import { html } from '/web_modules/lit-html/lit-html.js';

import { petsSelectedBreedType } from '../inputs/index.js';

export default (name, { availableBreedTypes }) => html`
    ${petsSelectedBreedType(availableBreedTypes)}

    <div class="section__actions">
        <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
    </div>
`;
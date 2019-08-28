import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { petsSelectedBreedType } from '../inputs/index.js';

export default function pets({ name, storage }) {
    const availableBreedTypes = storage.get('local', 'availableBreedTypes');

    return render(html`
        <h2>Your pet</h2>

        ${ petsSelectedBreedType(availableBreedTypes) }

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

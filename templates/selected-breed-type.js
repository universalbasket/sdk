import { html } from '../node_modules/lit-html/lit-html.js';

export default (breedTypes) => html`
<div class="job-input">
    <form id="selected-breed-type">
        <h3>What is your pet's breed?</h3>
        <label for="selected-breed-type"></label>
        ${ breedTypes.map(b => html`
            <label for="selected-breed-type">
                <input type="radio" name="selected-breed-type" value="${b}"/> ${b}
            </label>`
        )}
    </form>
    <button type="button" id="create-input-selected-breed-type">Create Input</button>
</div>
`;

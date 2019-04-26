import { html } from '../node_modules/lit-html/lit-html.js';

const addInput = (breedType) => html`<input type="radio" name="selected-breed-type" value="${breedType}">`;

export default (breedTypes) => html`
<div class="job-input">
    <form id="selected-breed-type">
        <h3>What is your pet's breed?</h3>
        <label for="is-kept-at-your-address">Is your pet kept at your address?</label>
        ${ breedTypes.map(addInput) }
    </form>
    <button type="button" id="create-input-selected-breed-type">Create Input</button>
</div>
`;

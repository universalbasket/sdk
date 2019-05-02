import { html } from '../../src/lit-html';

export default () => html`
<div class="job-input">
    <div class="section-header">
        <span>About you</span>
    </div>
    <form id="pets">
        <p>Forms for owner appears here.</p>
    </form>

    <!-- <button type="button" id="">Add pet</button> -->
    <button type="button" id="create-input-owner">Create Input</button>
</div>
`;

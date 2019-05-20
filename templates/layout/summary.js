import { html } from '../../src/lit-html';

export default (inputs = {}) => html`
<div class="summary">
    <b>MoreThan</b>
    <span class="dimmed">Pet Insurance</span>
    <div id="pet-detail">
        ${inputs.pets ? pet(inputs.pets[0]) : ''}
    </div>
    <ul id="policy-detail">
        ${inputs.policyOption && inputs.policyOption.coverStartDate ? startDate(inputs.policyOptions) : ''}
        ${inputs.selectedCover ? html`<li>${inputs.selectedCover}</li>` : ''}
        ${inputs.selectedVoluntaryExcess ? html`<li>${inputs.selectedVoluntaryExcess.name}</li>` : ''}
        ${inputs.selectedPaymentTerm ? html`<li>${inputs.selectedPaymentTerm}</li>` : ''}
    </ul>
</div>`;

const pet = (pet) => html`
<h5>Your ${pet.name} </h5>
<ul>
    <li> Breed Name: ${pet.breedName}</li>
    <li> Date of Birth: ${pet.dateOfBirth}</li>
    <li> Paid/Donated: £ ${(Number(pet.petPrice) * 100).toFixed(2)}</li>
</ul>
`;

const startDate = (policyOptions) => {
    const { coverStartDate } = policyOptions;
    return html`
        <li>
            Starts ${coverStartDate}
        </li>
    `;
};
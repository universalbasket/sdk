import { html } from '../../src/lit-html';

//get service name & domain
export default (inputs = {}, outputs = {}) => html`
<div class="summary">
    <div class="summary__header">
        <b>MoreThan</b>
        <span class="dimmed">Pet Insurance</span>
    </div>

    <section class="summary__body">
        <div id="pet-detail" class="summary__block">
            ${inputs.pets ? pet(inputs.pets[0]) : ''}
        </div>

        <div id="policy-detail" class="summary__block">
            <ul>
                ${inputs.policyOption && inputs.policyOption.coverStartDate ? startDate(inputs.policyOptions) : ''}
                ${inputs.selectedCover ? html`<li>${inputs.selectedCover}</li>` : ''}
                ${inputs.selectedVoluntaryExcess ? html`<li>${inputs.selectedVoluntaryExcess.name}</li>` : ''}
                ${inputs.selectedPaymentTerm ? html`<li>${inputs.selectedPaymentTerm}</li>` : ''}
            </ul>
        </div>

        <div id="policy-info" class="summary__block">
        <h5 class="summary__block-title"> Your Document </h5>
            <ul>
                ${outputs.insuranceProductInformationDocument && inputs.policyOption.coverStartDate ? startDate(inputs.policyOptions) : ''}
            </ul>
        </div>

    </section>
</div>`;

const pet = (pet) => html`
<h5 class="summary__block-title"> Your ${pet.name} </h5>
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
/**
 *
 *  insuranceProductInformationDocument
 * 	essentialInformation
 * 	policyWording
 *  eligibilityConditions
 *  estimatedPrice
 *
 */
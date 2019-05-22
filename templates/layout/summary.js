import { html } from '../../src/lit-html';

//get service name & domain
export default (inputs = {}, outputs = {}) => html`
<div class="summary">
    <div class="summary__header">
        <b>MoreThan</b>
        <span class="dimmed">Pet Insurance</span>
    </div>

    <section class="summary__body">
        ${inputs.pets ?
            html`
            <div id="pet-detail" class="summary__block">
                ${pet(inputs.pets[0])}
            </div>
            ` : ''}


        ${inputs.policyOptions || inputs.selectedCover || inputs.selectedVoluntaryExcess || inputs.selectedPaymentTerm ?
        html`
        <div id="policy-detail" class="summary__block">
            <h5 class="summary__block-title"> Your Policy </h5>
            <ul>
                ${inputs.policyOptions && inputs.policyOptions.coverStartDate ? startDate(inputs.policyOptions) : ''}
                ${inputs.selectedCover ? html`<li>Cover: ${inputs.selectedCover}</li>` : ''}
                ${inputs.selectedVetPaymentTerm ? html`<li> Vet Payment Term: ${inputs.selectedVetPaymentTerm}</li>` : ''}
                ${inputs.selectedPaymentTerm ? html`<li>Payment term: ${inputs.selectedPaymentTerm}</li>` : ''}
                ${inputs.selectedCoverType ? html`<li>Cover type: ${inputs.selectedCoverType.coverName} - ${(inputs.selectedCoverType.price.value * 0.01).toFixed(2)} ${inputs.selectedCoverType.price.currencyCode} </li>` : ''}
                ${inputs.selectedVetFee ? html`<li>Vet Fee:  - <p>${inputs.selectedVetFee.price.value * 0.01} ${inputs.selectedVetFee.price.currencyCode} </li>` : ''}
                ${inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${inputs.selectedVoluntaryExcess.name}</li>` : ''}
                ${inputs.selectedCoverOptions ? html`<li>Cover options: ${inputs.selectedCoverOptions}</li>` : ''}
            </ul>
        </div>` : ''
        }

        ${outputs.insuranceProductInformationDocument || outputs.essentialInformation || outputs.policyWording || outputs.eligibilityConditions ?
        html`
        <div id="policy-info" class="summary__block">
            <h5 class="summary__block-title"> Your Documents </h5>
            <ul>
                ${outputs.insuranceProductInformationDocument ? fileType(outputs.insuranceProductInformationDocument) : ''}
                ${outputs.essentialInformation ? fileType(outputs.essentialInformation) : ''}
                ${outputs.policyWording ? fileType(outputs.policyWording) : ''}
                ${outputs.eligibilityConditions ? htmlType(outputs.eligibilityConditions) : ''}
            </ul>
        </div>` : ''}

        ${outputs.estimatedPrice ?
            html`<div id="price" class="summary__block">
                ${price(outputs.estimatedPrice)}
            </div>`
            : ''}

    </section>
</div>`;

const pet = (pet) => html`
<h5 class="summary__block-title"> Your ${pet.name} </h5>
<ul>
    <li> Breed Name: ${pet.breedName}</li>
    <li> Date of Birth: ${pet.dateOfBirth}</li>
    <li> Paid/Donated: £ ${(Number(pet.petPrice)).toFixed(2)}</li>
</ul>
`;

const startDate = (policyOptions) => {
    const { coverStartDate } = policyOptions;
    return html`
        <li>
            Starts on ${coverStartDate}
        </li>
    `;
};

const fileType = (data) => {
    return html`
    <div>
        <h5>${data.name}</h5>
        <a>${data.filename}</a>
    </div>
`;
}

const htmlType = (data) => {
    return html`
    <div>
        <h5>${data.name}</h5>
        ${data.html}
    </div>`;
}

const price = (data) => {
    return html`
        <h5>Price</h5>
        <span>${(data.price.value * 0.01).toFixed(2)} ${data.price.countryCode}</span>
    `;
}

/**
 *
 *  insuranceProductInformationDocument
 * 	essentialInformation
 * 	policyWording
 *  eligibilityConditions
 *  estimatedPrice
 *
 */
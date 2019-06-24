import { html, templates } from '/src/main.js';
import { selectedPaymentTerm, selectedNoClaimsDiscountProtection, account } from '../inputs/index.js';

export default (name, { availablePaymentTerms, availableNoClaimsDiscountProtection, quoteReference, vehicleDetails, statutoryStatusDisclosure }) => {
    return html`
        <p>
            You're insuring your
            <strong>${vehicleDetails.yearOfManufacture + ' ' + vehicleDetails.make + ' ' + vehicleDetails.model}</strong>
            reg <strong>${vehicleDetails.registrationNumber}</strong>
            <br>
            Your quote reference is <strong>${quoteReference}</strong>
        </p>

        <br>

        ${selectedPaymentTerm(availablePaymentTerms)}
        ${selectedNoClaimsDiscountProtection(availableNoClaimsDiscountProtection)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>

        <small><em>${statutoryStatusDisclosure.text}</em></small>`;
};

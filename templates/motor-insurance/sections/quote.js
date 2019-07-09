import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedPaymentTerm, SelectedNoClaimsDiscountProtection } from '../inputs/index.js';

export default function quote(name, options) {
    const {
        availablePaymentTerms,
        availableNoClaimsDiscountProtection,
        quoteReference,
        vehicleDetails,
        statutoryStatusDisclosure
    } = options;

    return render(html`
        <p>
            You're insuring your
            <strong>${vehicleDetails.yearOfManufacture + ' ' + vehicleDetails.make + ' ' + vehicleDetails.model}</strong>
            reg <strong>${vehicleDetails.registrationNumber}</strong>
            <br>
            Your quote reference is <strong>${quoteReference}</strong>
        </p>

        <br>

        ${SelectedPaymentTerm(availablePaymentTerms)}
        ${SelectedNoClaimsDiscountProtection(availableNoClaimsDiscountProtection)}

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>

        <small><em>${statutoryStatusDisclosure.text}</em></small>
    `);
}

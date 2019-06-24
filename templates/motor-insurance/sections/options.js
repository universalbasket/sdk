import { html, templates } from '/src/main.js';
import { selectedPolicyOption, selectedNoClaimsDiscountProtection, selectedVoluntaryExcess } from '../inputs/index.js';

export default (name, { selectedPaymentTerm, availableNoClaimsDiscountProtection, availableVoluntaryExcesses, availableLegalCovers, availableExcessProtectCovers, availablePersonalInjuryCovers, availableCarHireCovers, availableBreakdownCovers, availableWindscreenCovers, availableKeyReplacementCovers, availableMisfuelCovers }) => {
    return html`
        <p>Please select the options you are interested in adding to your motor insurance policy:</p>

        <div class="field-set">
            ${selectedVoluntaryExcess(availableVoluntaryExcesses)}
            ${selectedNoClaimsDiscountProtection(availableNoClaimsDiscountProtection)}
            ${selectedPolicyOption('Legal cover protection', 'selectedLegalCover', availableLegalCovers)}
            ${selectedPolicyOption('Excess protection', 'selectedExcessProtectCover', availableExcessProtectCovers)}
            ${selectedPolicyOption('Personal injury cover', 'selectedPersonalInjuryCover', availablePersonalInjuryCovers)}
            ${selectedPolicyOption('Car hire cover', 'selectedCarHireCover', availableCarHireCovers)}
            ${selectedPolicyOption('Breakdown cover', 'selectedBreakdownCover', availableBreakdownCovers)}
            ${selectedPolicyOption('Windscreen cover', 'selectedWindscreenCover', availableWindscreenCovers)}
            ${selectedPolicyOption('Key replacement cover', 'selectedKeyReplacementCover', availableKeyReplacementCovers)}
            ${selectedPolicyOption('Misfuel cover', 'selectedMisfuelCover', availableMisfuelCovers)}
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

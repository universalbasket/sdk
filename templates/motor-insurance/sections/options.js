import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { selectedPolicyOption, selectedNoClaimsDiscountProtection, selectedVoluntaryExcess } from '../inputs/index.js';

export default function options(name, options) {
    const {
        availableNoClaimsDiscountProtection,
        availableVoluntaryExcesses,
        availableLegalCovers,
        availableExcessProtectCovers,
        availablePersonalInjuryCovers,
        availableCarHireCovers,
        availableBreakdownCovers,
        availableWindscreenCovers,
        availableKeyReplacementCovers,
        availableMisfuelCovers,
        serviceName
    } = options;

    return render(html`
        <p>Please select the options you are interested in adding to your ${serviceName} motor insurance policy:</p>

        ${selectedVoluntaryExcess(availableVoluntaryExcesses)}

        <div class="field-set">
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
        </div>
    `);
}

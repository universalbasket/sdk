import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedPolicyOption, SelectedNoClaimsDiscountProtection, SelectedVoluntaryExcess } from '../inputs/index.js';

export default function options({ name, data }) {
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
    } = data;

    return render(html`
        <p>Please select the options you are interested in adding to your ${serviceName} motor insurance policy:</p>

        ${SelectedVoluntaryExcess(availableVoluntaryExcesses)}

        <div class="field-set">
            ${SelectedNoClaimsDiscountProtection(availableNoClaimsDiscountProtection)}
            ${SelectedPolicyOption('Legal cover protection', 'selectedLegalCover', availableLegalCovers)}
            ${SelectedPolicyOption('Excess protection', 'selectedExcessProtectCover', availableExcessProtectCovers)}
            ${SelectedPolicyOption('Personal injury cover', 'selectedPersonalInjuryCover', availablePersonalInjuryCovers)}
            ${SelectedPolicyOption('Car hire cover', 'selectedCarHireCover', availableCarHireCovers)}
            ${SelectedPolicyOption('Breakdown cover', 'selectedBreakdownCover', availableBreakdownCovers)}
            ${SelectedPolicyOption('Windscreen cover', 'selectedWindscreenCover', availableWindscreenCovers)}
            ${SelectedPolicyOption('Key replacement cover', 'selectedKeyReplacementCover', availableKeyReplacementCovers)}
            ${SelectedPolicyOption('Misfuel cover', 'selectedMisfuelCover', availableMisfuelCovers)}
        </div>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

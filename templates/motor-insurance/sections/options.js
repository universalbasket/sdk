import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import { SelectedPolicyOption, SelectedNoClaimsDiscountProtection, SelectedVoluntaryExcess } from '../inputs/index.js';

export default function options({ name, storage }) {
    const availableNoClaimsDiscountProtection = storage.get('output', 'availableNoClaimsDiscountProtection');
    const availableVoluntaryExcesses = storage.get('output', 'availableVoluntaryExcesses');
    const availableLegalCovers = storage.get('output', 'availableLegalCovers');
    const availableExcessProtectCovers = storage.get('output', 'availableExcessProtectCovers');
    const availablePersonalInjuryCovers = storage.get('output', 'availablePersonalInjuryCovers');
    const availableCarHireCovers = storage.get('output', 'availableCarHireCovers');
    const availableBreakdownCovers = storage.get('output', 'availableBreakdownCovers');
    const availableWindscreenCovers = storage.get('output', 'availableWindscreenCovers');
    const availableKeyReplacementCovers = storage.get('output', 'availableKeyReplacementCovers');
    const availableMisfuelCovers = storage.get('output', 'availableMisfuelCovers');
    const serviceName = storage.get('_', 'serviceName');

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

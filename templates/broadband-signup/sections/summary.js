import { html } from '/web_modules/lit-html/lit-html.js';
import render from '../render.js';
import templates from '../helpers/index.js';

export default function summary({ name, storage }) {
    const selectedBroadbandPackage = storage.get('input', 'selectedBroadbandPackage');
    const selectedTvPackages = storage.get('input', 'selectedTvPackages');
    const selectedPhonePackage = storage.get('input', 'selectedPhonePackage');
    const oneOffCosts = storage.get('output', 'oneOffCosts');
    const monthlyCosts = storage.get('output', 'monthlyCosts');

    return render(html`
        <h2>Summary</h2>

        <h3>Your package</h3>
        <table class="table">
            <tr>
                <th>Broadband</th>
                <td>${ selectedBroadbandPackage.name }</td>
            </tr>
            <tr>
                <th>TV</th>
                <td>${ selectedTvPackages.map(_ => _.name).join(', ') }</td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>${ selectedPhonePackage.name }</td>
            </tr>
        </table>

        <h3>${ oneOffCosts.name }</h3>
        <table class="table">
            ${ oneOffCosts.contents.map(i => html`
                <tr>
                    <th>${ i.name }</th>
                    <td>${ templates.priceDisplay(i.price) }</td>
                </tr>`) }
        </table>

        <h3>${ monthlyCosts.name }</h3>
        <table class="table">
            ${ monthlyCosts.contents.map(i => html`
                <tr>
                    <th>${ i.name }</th>
                    <td>${ templates.priceDisplay(i.price) }</td>
                </tr>`) }
        </table>

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>
    `);
}

import { html } from '/web_modules/lit-html/lit-html.js';

export default (name, { selectedBroadbandPackage, selectedTvPackages, selectedPhonePackage }) => {
    return html`
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

        <div class="section__actions">
            <button
                type="button"
                class="button button--right button--primary"
                id="submit-btn-${name}">Continue</button>
        </div>`;
};

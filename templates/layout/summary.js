import { html } from '../../src/lit-html';
/*
see https://lit-html.polymer-project.org/guide/template-reference#cache
for details view and summary view for mobile version.
*/

//get service name & domain
export default (inputs = {}, outputs = {}, cache = {}) => html`
<div class="summary">
    <div class="summary__header">
        <b>USwitch</b>
        <span class="dimmed">Broadband Signup</span>
    </div>

    <section class="summary__body">
        ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
            html`
            <div id="package-detail" class="summary__block">
                <h5 class="summary__block-title"> Your Package </h5>
                <ul>
                    ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage}</li>` : ''}
                    ${inputs.selectedTvPackages ? html`<li> TV : ${inputs.selectedTvPackages}</li>` : ''}
                    ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage}</li>` : ''}
                </ul>
            </div>` : ''}
    </section>
</div>`;

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

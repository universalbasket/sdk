import { html } from '/web_modules/lit-html/lit-html.js';

const showModal = ({ title, content }) =>
    new CustomEvent('show-modal', { detail: { title, content }});

export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${ console.info(inputs)}
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block summary__block--list">
            <ul class="dim">
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`<li> TV: ${inputs.selectedTvPackages.map(_ => _.name).join(', ')}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
                <li>
                    <span
                        class="clickable"
                        @click=${() => window.dispatchEvent(showModal({
                            title: '10% Vet fee excess',
                            content: html`
                                <p class="dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>
                                <p class="dim">Morbi orci metus, commodo sit amet suscipit ac, pharetra eu mauris. Morbi sagittis lacus vel lacus finibus mollis. Phasellus arcu velit, viverra a eros ac, semper fringilla lectus. Sed varius sodales sapien nec auctor. Nam eget ornare lectus. Proin vehicula, urna nec congue rutrum, nunc odio pharetra nibh, eu dictum justo ante ut risus. Ut vulputate rhoncus dolor, id pharetra nisl semper quis. Nam tristique molestie lacinia. Aliquam vestibulum gravida ex id consequat. Suspendisse quis porta libero, cursus ultrices enim.</p>
                            `})
                        )}>
                        10% Vet fee excess
                    </span>
                </li>
            </ul>
        </div>` : ''}
        <div class="summary__block">
            <b class="large highlight">£14.99</b>
        </div>
        <div class="summary__block summary__block--docs">
            <p><b>Documents</b></p>
            <ul class="dim">
                <li class="file">Insurance product information</li>
                <li class="file">Essential information</li>
                <li class="file">Policy wording</li>
            </dim>
        </div>
</div>`;

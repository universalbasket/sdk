import { html, templates } from '/src/main.js';
//import { } from '../inputs/index.js';

export default (name, { feesSummary }) => {
    window.scrollTo({ top: document.querySelectorAll('.page form:not(.form--disabled)')[0].offsetTop -110, behaviour: 'smooth' });
    
    return html`
        <h2>Fees summary</h2>

        <div class="section__hide-disabled">
            <ul>
                ${ feesSummary.contents.map(a => {
                    return html`
                        <li>${a.text}</li>
                    `;
                })}
            </ul>

            <div class="section__actions">
                <button
                    type="button"
                    class="button button--right button--primary"
                    id="submit-btn-${name}">Continue</button>
            </div>
        </div>`;
};

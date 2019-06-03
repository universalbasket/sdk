import { html, render } from 'lit-html';

export default (selector = '#app') => {
    return {
        renderer: {
            init: () => {
                const target = document.querySelector(selector);
                if (!target) {
                    throw new Error(`loading: selector ${selector} not found`);
                }

                render(template, target);
            }
        }
    }
}

const template = html`
<div class="loading">
    <h2 id="loading-message">
        We are preparing your form...
    </h2>
</div>
`;

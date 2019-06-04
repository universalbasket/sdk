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
<div>
    <h2>We’re sorry. We can’t continue your purchase at the moment.</h2>
</div>
`;
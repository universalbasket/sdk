export default function notFound(selector) {
    return {
        renderer: {
            init: () => {
                const element = document.querySelector(selector);

                element.innerHTML = `
                    <div class="page">
                        <h2>Uh oh, We can't find the page.</h2>
                        <button type="button" class="button button--right button--primary">Continue</button>
                    </div>
                `;

                element.querySelector('button').onclick = () => window.location.reload();
            }
        }
    };
}

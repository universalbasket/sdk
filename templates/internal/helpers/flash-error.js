
export default function create(error) {
    const selector = '.sdk-app-bundle-layout-flash-error';
    const el = document.querySelector(selector);

    if (error) {
        console.error(error);
    }

    return {
        show() {
            if (el) {
                throw new Error('Document does not have nodes matching ' + selector + ' selector');
            }

            el.innerHTML = `
                <div class="flash-error">
                    <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
                    <p>Please check the items in red below.</p>
                </div>
            `;
        },
        hide() {
            while (el && el.lastChild) {
                el.removeChild(el.lastChild);
            }
        }
    };
}

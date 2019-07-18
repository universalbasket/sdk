export default function create(error) {
    const el = document.querySelector('.sdk-app-bundle-layout-flash-error');

    if (error) {
        console.error(error);
    }

    return {
        show() {
            el.innerHTML = `
                <div class="flash-error">
                    <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
                    <p>Please check the items in red below.</p>
                </div>
            `;
        },
        hide() {
            while (el.lastChild) {
                el.removeChild(el.lastChild);
            }
        }
    };
}

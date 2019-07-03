const domain = new URLSearchParams(window.location.search).get('domain');
const url = domain ? `/?domain=${domain}` : '/';

export default selector => {
    return {
        init() {
            document.querySelector(selector).innerHTML = `
                <div class="page">
                    <div>
                        <p class="large">
                            <b>We’re sorry. We can’t continue your purchase at the moment.</b>
                        </p>
                        <p class="dim">
                            You can retry or get in touch with us at configurable@emailaddre.ss
                        </p>
                        <p>
                            <a href="${url}" class="button button--primary">Retry</a>
                        </p>
                    </div>
                </div>
            `;
        }
    };
};

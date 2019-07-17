export default function(layout) {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="app">
            <header class="app__sticky-top">
                <div class="app__header-wrapper">
                    <div class="app__container sdk-app-bundle-layout-header"></div>
                </div>
                <div class="app__flash-error-wrapper">
                    <div class="app__container sdk-app-bundle-layout-flash-error"></div>
                </div>
                <div class="app__summary-wrapper app__summary-wrapper--mobile sdk-app-bundle-layout-summary-mobile"></div>
            </header>

            <div class="app__progress-bar-wrapper">
                <div class="app__container sdk-app-bundle-layout-progress-bar"></div>
            </div>

            <main class="app__container">
                <section class="app__main-wrapper sdk-app-bundle-layout-main"></section>
                <aside class="app__summary-wrapper app__summary-wrapper--desktop sdk-app-bundle-layout-summary-desktop"></aside>
            </main>

            <footer class="app__footer-wrapper">
                <div class="app__container sdk-app-bundle-layout-footer"></div>
            </footer>

            <div class="sdk-app-bundle-layout-modal"></div>
        </div>
    `.trim();

    const fragment = template.content;

    fragment.querySelector('.sdk-app-bundle-layout-header').appendChild(layout.header());
    fragment.querySelector('.sdk-app-bundle-layout-footer').appendChild(layout.footer());

    return fragment;
}

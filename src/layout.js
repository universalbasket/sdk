export default function() {
    return `
        <div class="app">
            <header class="app__sticky-top">
                <div class="app__header-wrapper">
                    <div
                        id="header"
                        class="app__container"></div>
                </div>
                <div class="app__flash-error-wrapper">
                    <div
                        id="flash-error"
                        class="app__container"></div>
                </div>
                <div
                    id="summary-mobile"
                    class="app__summary-wrapper app__summary-wrapper--mobile"></div>
            </header>

            <div class="app__progress-bar-wrapper">
                <div
                    id="progress-bar"
                    class="app__container"></div>
            </div>

            <main class="app__container">
                <section
                    id="main"
                    class="app__main-wrapper"></section>
                <aside
                    id="summary-desktop"
                    class="app__summary-wrapper app__summary-wrapper--desktop"></aside>
            </main>

            <footer class="app__footer-wrapper">
                <div class="app__container" id="footer"></div>
            </footer>

            <div id="modal"></div>
        </div>
    `;
}

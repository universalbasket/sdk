import { html } from '/web_modules/lit-html/lit-html.js';

const Layout = () => html`
    <header class="sticky-top">
        <div class="header-wrapper">
            <div id="header" class="container"></div>
        </div>
        <div class="flash-error-wrapper">
            <div id="error" class="container"></div>
        </div>
        <div id="summary-mobile" class="summary-wrapper summary-wrapper--mobile"></div>
    </header>

    <div class="progress-bar-wrapper">
        <div class="container" id="progress-bar"></div>
    </div>

    <main class="container">
        <section id="main" class="main-wrapper"></section>
        <aside id="summary-desktop" class="summary-wrapper summary-wrapper--desktop"></aside>
    </main>

    <footer id="footer"></footer>

    <div id="modal"></div>
`;

export default Layout;

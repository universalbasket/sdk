import { html } from '/web_modules/lit-html/lit-html.js';

const Layout = () => html`
    <div class="sticky-top">
        <header class="header-wrapper">
            <div id="header" class="container"></div>
        </header>
        <div class="flash-error-wrapper">
            <div id="error" class="container"></div>
        </div>
        <div id="summary-mobile" class="summary-wrapper summary-wrapper--mobile"></div>
    </div>

    <div class="progress-bar-wrapper">
        <div class="container" id="progress-bar"></div>
    </div>

    <div class="container">
        <main id="main" class="main-wrapper"></main>
        <aside id="summary-desktop" class="summary-wrapper summary-wrapper--desktop"></aside>
    </div>

    <div id="footer"></div>
    <div id="modal"></div>
`;

export default Layout;

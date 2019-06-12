import { html } from '/web_modules/lit-html/lit-html.js';
import { cache } from '/web_modules/lit-html/directives/cache.js';

const mobileView = () => html`
    <div class="sticky-top">
        <header id="header" class="header-wrapper"></header>
        <div id="error" class="flash-error-wrapper"></div>
        <div id="summary" class="summary-wrapper summary-wrapper--mobile"></div>
    </div>

    <div id="progress-bar" class="progress-bar-wrapper"></div>
    <div class="container">
        <main id="main" class="main-wrapper"></main>
    </div>
    <div id="footer"></div>
    <div id="modal"></div>
`;

const desktopView = () => html`
    <div class="sticky-top">
        <header class="header-wrapper">
            <div id="header" class="container"></div>
        </header>
        <div class="flash-error-wrapper">
            <div id="error" class="container"></div>
        </div>
    </div>

    <div class="progress-bar-wrapper">
        <div class="container" id="progress-bar"></div>
    </div>

    <div class="container">
        <main id="main" class="main-wrapper"></main>
        <aside id="summary" class="summary-wrapper"></aside>
    </div>

    <div id="footer"></div>
    <div id="modal"></div>
`;

function Layout(isMobile) {
    return html`${ cache(isMobile ? mobileView() : desktopView()) }`;
}

export default Layout;

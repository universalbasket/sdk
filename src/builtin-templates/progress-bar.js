import { html } from '/web_modules/lit-html/lit-html.js';

const stepTemplate = (title, index, activeIndex) => html`
    <li class="progress-bar__step ${activeIndex != null && index === activeIndex ? 'progress-bar__step--active' : ''}">
        <div class="progress-bar__icon-container">
            <div class="progress-bar__icon">
                <span class="progress-bar__step-index">${index}</span>
            </div>
        </div>
        <div class="progress-bar__label">${title}</div>
    </li>`;

export default (titles, activeIndex) => {
    return  html`
<ol class="progress-bar">
    ${ titles.map((title, index) => stepTemplate(title, index + 1, activeIndex))}
</ol>
`
};

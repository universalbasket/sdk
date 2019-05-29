import { html } from '../../src/lit-html';

const stepTemplate = (title, index, activeIndex) => html`
    <li class="progress-bar__step ${index === activeIndex ? 'progress-bar__step--active' : ''}">
        <div class="progress-bar__icon-container">
            <div class="progress-bar__icon">
                <span class="progress-bar__step-index">${index}</span>
            </div>
        </div>
        <div class="progress-bar__label">${title}</div>
    </li>`;

export default (titles, activeIndex) => {
    console.log(titles, activeIndex);
    return  html`
<ol class="progress-bar">
    ${ titles.map((title, index) => stepTemplate(title, index + 1, activeIndex))}
</ol>
`
};
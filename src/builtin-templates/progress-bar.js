import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import { styleMap } from '/web_modules/lit-html/directives/style-map.js';

function StepIcon(title, i, activeIndex) {
    const classes = {
        'progress-bar__step': true,
        'progress-bar__step--active': activeIndex != null && i === activeIndex
    };

    return html`<div class="${classMap(classes)}">${ i }</div>`;
}

function StepLabel(titles, activeIndex) {
    if (!activeIndex) {
        return '';
    }

    let leftRuler = activeIndex - 1;
    let rightRuler = activeIndex + 2;
    let textAlign = 'center';

    if (titles[activeIndex - 1].length > 14) {
        leftRuler = activeIndex - 2;
        rightRuler = activeIndex + 3;
    }

    if (activeIndex <= 1) {
        leftRuler = 1;
        rightRuler = -1;
    }

    if (rightRuler > titles.length) {
        rightRuler = -1;
    }

    if (activeIndex === 1) {
        textAlign = 'left';
    }

    if (activeIndex === titles.length) {
        textAlign = 'right';
    }

    const styles = {
        'grid-column-start': `${ leftRuler }`,
        'grid-column-end': `${ rightRuler }`,
        textAlign
    };

    return html`
    <span class="progress-bar__current-step" style="${styleMap(styles)}">
        ${ titles[activeIndex - 1] }
    </span>`;
}

export default (titles, activeIndex) => html`
    <div class="progress-bar"
        style="${ styleMap({ 'grid-template-columns': `repeat(${titles.length}, var(--step-icon-size))` }) }">
        ${ titles.map((title, index) => StepIcon(title, index + 1, activeIndex)) }
        ${ StepLabel(titles, activeIndex) }
    </div>`;

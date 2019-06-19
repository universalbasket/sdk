import { html } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import { styleMap } from '/web_modules/lit-html/directives/style-map.js';

function StepIcon(i, activeIndex) {
    const classes = {
        'progress-bar__step': true,
        'progress-bar__step--active': activeIndex != null && i === activeIndex
    };

    return html`<div class="${classMap(classes)}">${ i + 1 }</div>`;
}

function StepLabel(activeLabel, activeIndex, totalSteps) {
    if (activeLabel == null || activeIndex == null) {
        return '';
    }

    let leftRuler = activeIndex;
    let rightRuler = activeIndex + 3;
    let textAlign = 'center';

    if (activeLabel.length > 14) {
        leftRuler = activeIndex - 1;
        rightRuler = activeIndex + 4;
    }

    if (leftRuler <= 0) {
        leftRuler = 1;
    }

    if (rightRuler > totalSteps) {
        rightRuler = -1;
    }

    if (activeIndex === 0) {
        textAlign = 'left';
        rightRuler = -1;
    }

    if (activeIndex + 1 === totalSteps) {
        textAlign = 'right';
        leftRuler = 1;
    }

    const styles = {
        'grid-column-start': `${ leftRuler }`,
        'grid-column-end': `${ rightRuler }`,
        textAlign
    };

    return html`
    <span class="progress-bar__current-step" style="${styleMap(styles)}">
        ${ activeLabel }
    </span>`;
}

export default (titles, activeLabel, activeStep) => html`
    <div class="progress-bar"
        style="${ styleMap({ 'grid-template-columns': `repeat(${titles.length}, var(--progress-step-icon-size))` }) }">
        ${ titles.map((_title, index) => StepIcon(index, activeStep)) }
        ${ StepLabel(activeLabel, activeStep, titles.length) }
    </div>`;

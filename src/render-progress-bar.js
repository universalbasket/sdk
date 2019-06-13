import { html, render } from '/web_modules/lit-html/lit-html.js';
import { classMap } from '/web_modules/lit-html/directives/class-map.js';
import { styleMap } from '/web_modules/lit-html/directives/style-map.js';

class ProgressBar {
    constructor(selector = '#progress-bar', titles = []) {
        if (titles.length === 0) {
            throw new Error('ProgressBar constructor: titles can not be empty');
        }

        this.selector = selector;
        this.titles = titles;
    }

    update(activeStep) {
        const activeLabel = activeStep == null ? null : this.titles[activeStep];
        const target = document.querySelector(this.selector);
        if (!target) {
            throw new Error(`ProgressBar constructor: element for given ${this.selector} not found`);
        }
        render(template(this.titles, activeLabel, activeStep), target);
    }
}

function template(titles, activeLabel, activeStep) {
    return html`
    <div class="progress-bar"
        style="${ styleMap({ 'grid-template-columns': `repeat(${titles.length}, var(--step-icon-size))` }) }">
        ${ titles.map((_title, index) => StepIcon(index, activeStep)) }
        ${ StepLabel(activeLabel, activeStep, titles.length) }
    </div>`;
}

function StepIcon(index, activeIndex) {
    const classes = {
        'progress-bar__step': true,
        'progress-bar__step--active': activeIndex != null && index === activeIndex
    };

    return html`<div class="${classMap(classes)}">${ index + 1 }</div>`;
}

function StepLabel(activeLabel, activeIndex, totalSteps) {
    if (activeLabel == null || activeIndex == null) {
        return '';
    }

    let leftRuler = activeIndex;
    let rightRuler = activeIndex + 3;
    let textAlign = 'center';

    if (activeLabel.length > 14) {
        leftRuler = activeIndex - 2;
        rightRuler = activeIndex + 3;
    }

    if (activeIndex <= 1) {
        leftRuler = 1;
        rightRuler = -1;
    }

    if (rightRuler > totalSteps) {
        rightRuler = -1;
    }

    if (activeIndex === 0) {
        textAlign = 'left';
    }

    if (activeIndex + 1 === totalSteps) {
        textAlign = 'right';
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

export default function renderProgressBar(selector, titles) {
    return new ProgressBar(selector, titles);
}

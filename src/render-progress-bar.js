import progressBarTemplate from './builtin-templates/progress-bar.js';

class ProgressBar {
    constructor(selector, titles) {
        if (typeof selector !== 'string') {
            throw new Error('Progress bar requires a selector.');
        }

        if (!titles || titles.length === 0) {
            throw new Error('Progress bar requires a titles array which is not empty.');
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
        while (target.lastChild) {
            target.removeChild(target.lastChild);
        }
        target.appendChild(progressBarTemplate(this.titles, activeLabel, activeStep));
    }
}

export default function renderProgressBar(selector, titles) {
    return new ProgressBar(selector, titles);
}

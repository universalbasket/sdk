import progressBarTemplate from './builtin-templates/progress-bar.js';

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
        target.innerHTML = '';
        target.appendChild(progressBarTemplate(this.titles, activeLabel, activeStep));
    }
}

export default function renderProgressBar(selector, titles) {
    return new ProgressBar(selector, titles);
}

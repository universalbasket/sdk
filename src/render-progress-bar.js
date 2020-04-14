import progressBarTemplate from '../templates/internal/helpers/progress-bar.js';
import { get } from './storage.js';

class ProgressBar {
    constructor(selector, routes, template) {
        if (typeof selector !== 'string') {
            throw new Error('Progress bar requires a selector.');
        }
        this.template = template || progressBarTemplate;
        this.selector = selector;
        this.steps = Object.keys(routes)
            .filter((key) => {
                return routes[key].title && routes[key].step;
            }).map((key) => {
                return routes[key].title;
            }, {});
    }

    update(stepIndex) {
        const target = document.querySelector(this.selector);
        if (!target) {
            throw new Error(`ProgressBar constructor: element for given ${this.selector} not found`);
        }
        while (target.lastChild) {
            target.removeChild(target.lastChild);
        }
        target.appendChild(this.template(this.steps, stepIndex, { get }));
    }
}

export default function renderProgressBar(selector, routes, template) {
    return new ProgressBar(selector, routes, template);
}

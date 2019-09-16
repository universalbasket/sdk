import progressBarTemplate from './builtin-templates/progress-bar.js';

class ProgressBar {
    constructor(selector, routes) {
        if (typeof selector !== 'string') {
            throw new Error('Progress bar requires a selector.');
        }
        this.selector = selector;
        this.steps = Object.keys(routes)
            .reduce((res, key) => {
                const route = routes[key];
                if (route.step !== null && !route.excludeStep) {
                    res[route.step] = route.title;
                }
                return res;
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
        target.appendChild(progressBarTemplate(this.steps, stepIndex));
    }
}

export default function renderProgressBar(selector, routes) {
    return new ProgressBar(selector, routes);
}

import { render } from '/web_modules/lit-html.js';
import progressBar from './builtin-templates/progress-bar.js';

export default (selector) => {
    return (titles, activeIndex) => render(progressBar(titles, activeIndex), document.querySelector(selector))
};

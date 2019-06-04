import { render } from './lit-html';
import progressBar from './builtin-templates/progress-bar';

export default (selector) => {
    return (titles, activeIndex) => render(progressBar(titles, activeIndex), document.querySelector(selector))
};

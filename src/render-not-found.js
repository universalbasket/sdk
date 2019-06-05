import { render } from '/web_modules/lit-html.js';
import notFount404 from '../templates/not-found-404.js';

export default (selector) => ({ render: () => render(notFount404(), document.querySelector(selector)) })

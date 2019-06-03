import { render } from './lit-html';
import notFount404 from '../templates/not-found-404';

export default (selector) => { render: () => render(notFount404(), document.querySelector(selector)) }
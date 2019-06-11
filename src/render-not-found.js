import { render as lrender } from '/web_modules/lit-html/lit-html.js';
import notFount404 from './builtin-templates/not-found-404.js';

export default function(selector) {
    return {
        render() {
            lrender(notFount404(), document.querySelector(selector));
        }
    };
}

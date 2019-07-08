import { render as litRender } from '/web_modules/lit-html/lit-html.js';

export default function render(templateResult) {
    const fragment = document.createDocumentFragment();

    litRender(templateResult, fragment);

    return fragment;
}

import { html } from '/web_modules/lit-html/lit-html.js';
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js';
import PriceDisplay from './price-display.js';

function markup(item) {
    if (item.type === 'StructuredText') {
        return html`
            <article>
                <header>
                    <p><b>${item.name}</b></p>
                </header>
                <div class="dim">${item.contents.map(markup)}</div>
            </article>`;
    }

    switch (item.type) {
        case 'Text': return html`<p>${item.text}</p>`;
        case 'Link': return html`<a href="${item.url}" target="_blank">${item.name}</a>`;
        case 'HTML': return unsafeHTML(item.html);
        case 'NamedText': return html`<p><b>${item.name}</b><br />${item.text}</p>`;
        case 'NamedPrice': return html`<p><b>${item.name}</b><br />${PriceDisplay(item.price)}</p>`;
        default: return '';
    }
}

export default markup;

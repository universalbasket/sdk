import priceDisplay from './price-display.js';
import file from './file-download.js';

function buildForStructuredText(item, sdk) {
    const article = document.createElement('article');
    article.innerHTML = `
        <header>
            <p><b></b></p>
        </header>
        <div class="dim"></div>
    `;

    article.querySelector('b').append(item.name);

    const contents = item.contents.map(item => markup(item, sdk));

    article.querySelector('.dim').append(...contents);

    return article;
}

function buildForStructuredPrice(item, sdk) {
    const article = document.createElement('article');
    article.innerHTML = `
        <header>
            <p><b></b><br /></p>
        </header>
        <div class="dim"></div>
    `;

    article.querySelector('b').append(item.name);
    article.querySelector('p').append(priceDisplay(item.price));
    article.querySelector('.dim').append(...item.contents.map(item => markup(item, sdk)));

    return article;
}

function buildForText(item) {
    const p = document.createElement('p');

    p.append(item.text);

    return p;
}

function buildForLink(item) {
    const a = document.createElement('a');

    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.append(item.name);

    return a;
}

function buildForHtml(item) {
    const template = document.createElement('template');

    template.innerHTML = item.html;

    return template.content;
}

function buildForNamedText(item) {
    const p = document.createElement('p');
    const b = document.createElement('b');

    b.append(item.name);
    p.append(b, document.createElement('br'), item.text);

    return p;
}

function buildForNamedPrice(item) {
    const p = document.createElement('p');
    const b = document.createElement('b');

    b.append(item.name);
    p.append(b, document.createElement('br'), priceDisplay(item.price));

    return p;
}

function markup(item, sdk) {
    switch (item.type) {
        case 'StructuredText': return buildForStructuredText(item, sdk);
        case 'StructuredPrice': return buildForStructuredPrice(item, sdk);
        case 'Text': return buildForText(item);
        case 'Link': return buildForLink(item);
        case 'File': return file(item, sdk);
        case 'HTML': return buildForHtml(item);
        case 'NamedText': return buildForNamedText(item);
        case 'NamedPrice': return buildForNamedPrice(item);
        default: return document.createTextNode('');
    }
}

export default markup;

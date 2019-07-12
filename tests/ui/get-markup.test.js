import getMarkup from '/src/builtin-templates/get-markup.js';
import priceDisplay from '/src/builtin-templates/price-display.js';
import Deferred from '/node_modules/es2015-deferred/index.js';

describe('get-markup', () => {
    describe('unknown item type', () => {
        it('renders an empty text node', () => {
            const result = getMarkup({});

            expect(result).instanceof(Text);
            expect(result.length).to.equal(0);
        });
    });

    describe('named price', () => {
        it('renders the name and price', () => {
            const name = 'Lorem Q 1TB box Install Fee';
            const price = {
                value: 2000,
                currencyCode: 'gbp'
            };

            const result = getMarkup({ type: 'NamedPrice', name, price });

            expect(result).instanceof(HTMLElement);
            expect(result.textContent).to.contain(name);
            expect(result.textContent).to.contain(priceDisplay(price).textContent);
        });
    });

    describe('named text', () => {
        it('renders the name and text', () => {
            const name = 'Text Name';
            const text = 'Lorem ipsum dolor sit amet';

            const result = getMarkup({ type: 'NamedText', text, name });

            expect(result).instanceof(HTMLElement);
            expect(result.textContent).to.contain(name);
            expect(result.textContent).to.contain(text);
        });
    });

    describe('html', () => {
        it('renders the html into a document fragment', () => {
            const result = getMarkup({
                type: 'HTML',
                html: '<p>a paragraph</p><span>a span</span>'
            });

            expect(result).instanceof(DocumentFragment);
            expect(result.children.length).to.equal(2);
            expect(result.firstChild).instanceof(HTMLParagraphElement);
            expect(result.firstChild.textContent).to.equal('a paragraph');
            expect(result.lastChild).instanceof(HTMLSpanElement);
            expect(result.lastChild.textContent).to.equal('a span');
        });
    });

    describe('link', () => {
        it('renders the link into an anchor element', () => {
            const name = 'Link Name';
            const url = 'https://example.com/';

            const result = getMarkup({ type: 'Link', url, name });

            expect(result).instanceof(HTMLAnchorElement);
            expect(result.href).to.equal(url);
            expect(result.target).to.equal('_blank');
            expect(result.rel).to.equal('noopener');
            expect(result.textContent).to.equal(name);
        });
    });

    describe('text', () => {
        it('renders the text into a paragraph element', () => {
            const text = 'Copyrights© Limited';

            const result = getMarkup({ type: 'Text', text });

            expect(result).instanceof(HTMLParagraphElement);
            expect(result.textContent).to.equal(text);
        });
    });

    describe('structured price', () => {
        it('renders the structure and content to an article', () => {
            const text = {
                type: 'Text',
                text: 'Copyrights© Limited'
            };
            const link = {
                type: 'Link',
                url: 'https://example.com/',
                name: 'Link Name'
            };
            const price = {
                value: 2000,
                currencyCode: 'gbp'
            };
            const structuredPrice = {
                type: 'StructuredPrice',
                name: 'Lorem Q 1TB box Install Fee',
                price,
                contents: [text, link]
            };

            const result = getMarkup(structuredPrice);
            const header = result.querySelector('header');

            expect(header.textContent).to.contain(structuredPrice.name);
            expect(header.textContent).to.contain(priceDisplay(price).textContent);

            const content = result.querySelector('.dim');

            expect(content.children.length).to.equal(2);
            expect(content.firstChild).instanceof(HTMLParagraphElement);
            expect(content.firstChild.textContent).to.equal(text.text);

            expect(content.lastChild).instanceof(HTMLAnchorElement);
            expect(content.lastChild.href).to.equal(link.url);
            expect(content.lastChild.target).to.equal('_blank');
            expect(content.lastChild.rel).to.equal('noopener');
            expect(content.lastChild.textContent).to.equal(link.name);
        });
    });

    describe('structured text', () => {
        it('renders the structure and content to an article', () => {
            const text = {
                type: 'Text',
                text: 'Copyrights© Limited'
            };
            const link = {
                type: 'Link',
                url: 'https://example.com/',
                name: 'Link Name'
            };
            const structuredText = {
                type: 'StructuredText',
                name: 'Here\'s the legal bit',
                contents: [text, link]
            };

            const result = getMarkup(structuredText);
            const header = result.querySelector('header');

            expect(header.textContent).to.contain(structuredText.name);

            const content = result.querySelector('.dim');

            expect(content.children.length).to.equal(2);
            expect(content.firstChild).instanceof(HTMLParagraphElement);
            expect(content.firstChild.textContent).to.equal(text.text);

            expect(content.lastChild).instanceof(HTMLAnchorElement);
            expect(content.lastChild.href).to.equal(link.url);
            expect(content.lastChild.target).to.equal('_blank');
            expect(content.lastChild.rel).to.equal('noopener');
            expect(content.lastChild.textContent).to.equal(link.name);
        });
    });

    describe('file', () => {
        let fileDeferred;
        let sdkMock;
        let sdkJobFileCalls;
        let file;

        beforeEach(() => {
            sdkJobFileCalls = [];
            fileDeferred = new Deferred();
            sdkMock = {
                getJobFile() {
                    sdkJobFileCalls.push([...arguments]);
                    return fileDeferred.promise;
                }
            };
            file = {
                type: 'File',
                filename: 'file-name.txt',
                name: 'a-name',
                url: 'https://example.com/a-file'
            };
        });

        it('calls sdk.getJobFile with the url', () => {
            getMarkup(file, sdkMock);

            expect(sdkJobFileCalls.length).to.equal(1);
            expect(sdkJobFileCalls[0][0]).to.equal(file.url);
        });

        it('renders a placeholder paragraph', () => {
            const result = getMarkup(file, sdkMock);

            expect(result).instanceof(HTMLSpanElement);
            expect(result.children.length).to.equal(1);
            expect(result.firstChild).instanceof(HTMLParagraphElement);
            expect(result.firstChild.textContent).to.equal('Preparing a download link...');
        });

        it('updates the placeholder paragraph with an error message when the file download fails', async () => {
            const result = getMarkup(file, sdkMock);

            const error = console.error;
            console.error = () => {};

            try {
                await fileDeferred.reject(new Error('an error'));
            } catch (e) {}

            console.error = error;

            expect(result).instanceof(HTMLSpanElement);
            expect(result.children.length).to.equal(1);
            expect(result.firstChild).instanceof(HTMLParagraphElement);
            expect(result.firstChild.textContent).to.equal('Error downloading file.');
        });

        it('replaces the placeholder with an anchor to a data URL when the file download succeeds', async () => {
            const result = getMarkup(file, sdkMock);
            const blob = new Blob(['Hello, world!'], { type : 'text/plain' });

            await fileDeferred.resolve(blob);

            expect(result).instanceof(HTMLSpanElement);
            expect(result.children.length).to.equal(1);
            expect(result.firstChild).instanceof(HTMLAnchorElement);
            expect(result.firstChild.target).to.equal('_blank');
            expect(result.firstChild.rel).to.equal('noopener');
            expect(result.firstChild.textContent).to.equal(file.name);

            const res = await fetch(result.firstChild.href);

            expect(res.status).to.equal(200);

            const recoveredText = await res.text();

            expect(recoveredText).to.equal('Hello, world!');
        });

        it('defaults to using the filename when the name field is not given', async () => {
            delete file.name;
            const result = getMarkup(file, sdkMock);
            const blob = new Blob(['Hello, world!'], { type : 'text/plain' });

            await fileDeferred.resolve(blob);

            expect(result).instanceof(HTMLSpanElement);
            expect(result.children.length).to.equal(1);
            expect(result.firstChild).instanceof(HTMLAnchorElement);
            expect(result.firstChild.target).to.equal('_blank');
            expect(result.firstChild.rel).to.equal('noopener');
            expect(result.firstChild.textContent).to.equal(file.filename);

            const res = await fetch(result.firstChild.href);

            expect(res.status).to.equal(200);

            const recoveredText = await res.text();

            expect(recoveredText).to.equal('Hello, world!');
        });
    });
});

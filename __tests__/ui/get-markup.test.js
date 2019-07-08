import getMarkup from '@/src/builtin-templates/get-markup.js';
import priceDisplay from '@/src/builtin-templates/price-display.js';
import Deferred from 'es2015-deferred';

describe('get-markup', () => {
    describe('unknown item type', () => {
        it('renders an empty text node', () => {
            const result = getMarkup({});

            expect(result).toBeInstanceOf(Text);
            expect(result.length).toBe(0);
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

            expect(result).toBeInstanceOf(HTMLElement);
            expect(result.textContent).toContain(name);
            expect(result.textContent).toContain(priceDisplay(price).textContent);
        });
    });

    describe('named text', () => {
        it('renders the name and text', () => {
            const name = 'Text Name';
            const text = 'Lorem ipsum dolor sit amet';

            const result = getMarkup({ type: 'NamedText', text, name });

            expect(result).toBeInstanceOf(HTMLElement);
            expect(result.textContent).toContain(name);
            expect(result.textContent).toContain(text);
        });
    });

    describe('html', () => {
        it('renders the html into a document fragment', () => {
            const result = getMarkup({
                type: 'HTML',
                html: '<p>a paragraph</p><span>a span</span>'
            });

            expect(result).toBeInstanceOf(DocumentFragment);
            expect(result.children.length).toBe(2);
            expect(result.firstChild).toBeInstanceOf(HTMLParagraphElement);
            expect(result.firstChild.textContent).toBe('a paragraph');
            expect(result.lastChild).toBeInstanceOf(HTMLSpanElement);
            expect(result.lastChild.textContent).toBe('a span');
        });
    });

    describe('link', () => {
        it('renders the link into an anchor element', () => {
            const name = 'Link Name';
            const url = 'https://example.com/';

            const result = getMarkup({ type: 'Link', url, name });

            expect(result).toBeInstanceOf(HTMLAnchorElement);
            expect(result.href).toBe(url);
            expect(result.target).toBe('_blank');
            expect(result.rel).toBe('noopener');
            expect(result.textContent).toBe(name);
        });
    });

    describe('text', () => {
        it('renders the text into a paragraph element', () => {
            const text = 'Copyrights© Limited';

            const result = getMarkup({ type: 'Text', text });

            expect(result).toBeInstanceOf(HTMLParagraphElement);
            expect(result.textContent).toBe(text);
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

            expect(header.textContent).toContain(structuredPrice.name);
            expect(header.textContent).toContain(priceDisplay(price).textContent);

            const content = result.querySelector('.dim');

            expect(content.children.length).toBe(2);
            expect(content.firstChild).toBeInstanceOf(HTMLParagraphElement);
            expect(content.firstChild.textContent).toBe(text.text);

            expect(content.lastChild).toBeInstanceOf(HTMLAnchorElement);
            expect(content.lastChild.href).toBe(link.url);
            expect(content.lastChild.target).toBe('_blank');
            expect(content.lastChild.rel).toBe('noopener');
            expect(content.lastChild.textContent).toBe(link.name);
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

            expect(header.textContent).toContain(structuredText.name);

            const content = result.querySelector('.dim');

            expect(content.children.length).toBe(2);
            expect(content.firstChild).toBeInstanceOf(HTMLParagraphElement);
            expect(content.firstChild.textContent).toBe(text.text);

            expect(content.lastChild).toBeInstanceOf(HTMLAnchorElement);
            expect(content.lastChild.href).toBe(link.url);
            expect(content.lastChild.target).toBe('_blank');
            expect(content.lastChild.rel).toBe('noopener');
            expect(content.lastChild.textContent).toBe(link.name);
        });
    });

    describe('file', () => {
        let fileDeferred;
        let sdkMock;
        let file;

        beforeEach(() => {
            fileDeferred = new Deferred();
            sdkMock = {
                getJobFile: jest.fn(() => fileDeferred.promise)
            };
            file = {
                type: 'File',
                filename: 'file-name.txt',
                name: 'a-name',
                url: 'https://example.com/a-file'
            };
            global.URL.createObjectURL = jest.fn(blob => `blob:${blob.length}`); // JSDom...
        });

        it('calls sdk.getJobFile with the url', () => {
            getMarkup(file, sdkMock);

            expect(sdkMock.getJobFile.mock.calls.length).toBe(1);
            expect(sdkMock.getJobFile.mock.calls[0][0]).toBe(file.url);
        });

        it('renders a placeholder paragraph', () => {
            const result = getMarkup(file, sdkMock);

            expect(result).toBeInstanceOf(HTMLSpanElement);
            expect(result.children.length).toBe(1);
            expect(result.firstChild).toBeInstanceOf(HTMLParagraphElement);
            expect(result.firstChild.textContent).toBe('Preparing a download link...');
        });

        it('updates the placeholder paragraph with an error message when the file download fails', async () => {
            const result = getMarkup(file, sdkMock);

            const error = console.error;
            console.error = () => {};

            try {
                await fileDeferred.reject(new Error('an error'));
            } catch (e) {}

            console.error = error;

            expect(result).toBeInstanceOf(HTMLSpanElement);
            expect(result.children.length).toBe(1);
            expect(result.firstChild).toBeInstanceOf(HTMLParagraphElement);
            expect(result.firstChild.textContent).toBe('Error downloading file.');
        });

        it('replaces the placeholder with an anchor to a data URL when the file download succeeds', async () => {
            const result = getMarkup(file, sdkMock);
            const blob = new Blob(['Hello, world!'], { type : 'text/plain' });

            await fileDeferred.resolve(blob);

            expect(result).toBeInstanceOf(HTMLSpanElement);
            expect(result.children.length).toBe(1);
            expect(result.firstChild).toBeInstanceOf(HTMLAnchorElement);
            // This only "works" in jsdom. A working implementation will create
            // a different URL for the same blob each time it is called, so this
            // can only be tested by fetching the URL and comparing the blobs.
            expect(result.firstChild.href).toBe(URL.createObjectURL(blob));
            expect(result.firstChild.target).toBe('_blank');
            expect(result.firstChild.rel).toBe('noopener');
            expect(result.firstChild.textContent).toBe(file.name);
        });
    });
});

import getMarkup from '@/src/builtin-templates/get-markup.js';
import priceDisplay from '@/src/builtin-templates/price-display.js';

const StructuredTextItems = {
    NamedPrice: {
        type: 'NamedPrice',
        name: 'Lorem Q 1TB box Install Fee',
        price: {
            value: 2000,
            currencyCode: 'gbp'
        }
    },
    NamedText: {
        type: 'NamedText',
        text: 'Lorem ipsum dolor sit amet',
        name: 'Text Name'
    },
    Text: {
        type: 'Text',
        text: 'Copyrights© Limited'
    },
    Link: {
        type: 'Link',
        url: 'url',
        name: 'Link Name'
    },
    File: {
        type: 'File',
        url: 'Location of the resource',
        name: 'The name or title of the document (optional)',
        filename: 'The name of the file, including the extension',
        headers: 'List of relevant headers associated with the uri. (optional)'
    },
    HTML: {
        html: `<div><div><div>
            <p>
                This is the eligibility criteria you must meet in order to take out a Lorem Pet Insurance.
                If you cannot meet this eligibility criteria, please call our dedicated Lorem Pet Team who will be happy to help.
                Call us on <span>0000 000 000</span>.
            </p>
            <h3>Eligibility Criteria</h3>
            <p>You and your pet must meet the following conditions.</p>
            <h3>You</h3>
            <ul>
                <li><span>&gt;</span> Must be the owner and keeper of the pet.</li>
                <li><span>&gt;</span> Must be at least 18 years old.</li>
                <li><span>&gt;</span> Must live permanently at your home address.</li>
                <li><span>&gt;</span> Must live in the United Kingdom, Isle of Man or the Channel Islands.</li>
                <li><span>&gt;</span> Must never have had any pet policy covering this pet declared void or cancelled.</li>
            </ul>
        </div></div></div>`,
        name: 'eligibility conditions',
        type: 'HTML'
    }
};

describe('getMarkup', () => {
    it('turns StructuredPrice into a template result', () => {
        const StructuredPrice = {
            type: 'StructuredPrice',
            name: 'Lorem Q 1TB box Install Fee',
            price: {
                value: 2000,
                currencyCode: 'gbp'
            },
            contents: [
                StructuredTextItems['Text'],
                StructuredTextItems['Link']
            ]
        };

        const result = getMarkup(StructuredPrice);
        expect(result).toEqual(
            expect.objectContaining({
                values: expect.arrayContaining([
                    StructuredPrice.name,
                    expect.arrayContaining([
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['Text'].text
                            ])
                        }),
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['Link'].name,
                                StructuredTextItems['Link'].url
                            ])
                        })
                    ])
                ])
            })
        );
    });

    it('turns StructuredText into a template result', () => {
        const jobOutput = {
            type: 'StructuredText',
            name: 'Here\'s the legal bit',
            contents: [
                {
                    type: 'StructuredText',
                    name: 'Copyrights',
                    contents: []
                },
                StructuredTextItems['Text'],
                StructuredTextItems['NamedPrice'],
                StructuredTextItems['NamedText'],
                StructuredTextItems['Link']
            ]
        };

        const result = getMarkup(jobOutput);
        expect(result).toEqual(
            expect.objectContaining({
                values: expect.arrayContaining([
                    jobOutput.name,
                    expect.arrayContaining([
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                'Copyrights',
                                expect.arrayContaining([])
                            ])
                        }),
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['Text'].text
                            ])
                        }),
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['NamedPrice'].name,
                                priceDisplay(StructuredTextItems['NamedPrice'].price)
                            ])
                        }),
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['NamedText'].name,
                                StructuredTextItems['NamedText'].text
                            ])
                        }),
                        expect.objectContaining({
                            values: expect.arrayContaining([
                                StructuredTextItems['Link'].name,
                                StructuredTextItems['Link'].url
                            ])
                        })
                    ])
                ])
            })
        );
    });

    it('turns HTML into a template result', () => {
        const HTML = StructuredTextItems['HTML'];

        const result = getMarkup(HTML);
        expect(result).toEqual(expect.objectContaining({
            values: expect.arrayContaining([
                expect.any(Function)
            ])
        }));
    });

    it('turns Text into a template result', () => {
        const Text = StructuredTextItems['Text'];

        const result = getMarkup(Text);
        expect(result).toEqual(expect.objectContaining({
            values: expect.arrayContaining([
                Text.text
            ])
        }));
    });

    it('turns NamedPrice into a template result', () => {
        const NamedPrice = StructuredTextItems['NamedPrice'];

        const result = getMarkup(NamedPrice);
        expect(result).toEqual(expect.objectContaining({
            values: expect.arrayContaining([
                NamedPrice.name,
                priceDisplay(NamedPrice.price)
            ])
        }));
    });

    it('turns NamedText into a template result', () => {
        const NamedText = StructuredTextItems['NamedText'];

        const result = getMarkup(NamedText);
        expect(result).toEqual(expect.objectContaining({
            values: expect.arrayContaining([
                NamedText.name,
                NamedText.text
            ])
        }));
    });

    it('turns Link into a template result', () => {
        const Link = StructuredTextItems['Link'];

        const result = getMarkup(Link);
        expect(result).toEqual(expect.objectContaining({
            values: expect.arrayContaining([
                Link.name,
                Link.url
            ])
        }));
    });

    describe('File', () => {
        // TODO
    });
});

import PriceDisplay from '@/src/builtin-templates/price-display.js'

describe('PriceDisplay UI', () => {
    describe('Unhappy case', () => {
        it('renders empty when no arg passed', () => {
            const result = PriceDisplay();
            expect(result).toBe('');
            expect(result.type).toBe(undefined);
        });

        it('renders empty when unexpected arg passed', () => {
            const result = PriceDisplay(1000);

            expect(result).toBe('');
            expect(result.type).toBe(undefined);
        });

        it('renders empty; when value currency symbol both undefined', () => {
            const result = PriceDisplay({
                currencyCode: 'idk'
            });

            expect(result).toBe('');
            expect(result.type).toBe(undefined);
        });
    });

    describe('Happy case', () => {
        it('renders currency symbol and price value', () => {
            const result = PriceDisplay({
                value: 999,
                currencyCode: 'gbp'
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: ['', '', ''],
                type: 'html',
                values: ['£', '9.99']
            });
        });

        it('renders FREE when value is zero', () => {
            const result = PriceDisplay({
                value: 0,
                currencyCode: 'gbp'
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: ['FREE'],
                type: 'html',
                values: []
            });
        });

        it('renders 0.00 when value is \'zero\'', () => {
            const result = PriceDisplay({
                value: '0',
                currencyCode: 'gbp'
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: ['', '', ''],
                type: 'html',
                values: ['£', '0.00']
            });
        });
    });

    describe('Partial case', () => {
        it('renders currency symbol with &middot; when value is undefined', () => {
            const result = PriceDisplay({
                currencyCode: 'gbp'
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: ['', ' &middot;'],
                type: 'html',
                values: ['£']
            });
        });

        it('renders currencyCode; when currency symbol is undefined', () => {
            const result = PriceDisplay({
                currencyCode: 'idk',
                value: 999
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: ['', '', ''],
                type: 'html',
                values: ['9.99', 'idk']
            });
        });
    });
});

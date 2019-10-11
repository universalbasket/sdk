import PriceDisplay from '/templates/hotel-booking/helpers/price-display.js';

function wrap(price) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(PriceDisplay(price));
    return wrapper;
}

describe('PriceDisplay UI', () => {
    describe('Unhappy case', () => {
        it('renders empty when no arg passed', () => {
            const result = wrap();

            expect(result.textContent).to.equal('');
        });

        it('renders empty when unexpected arg passed', () => {
            const result = wrap(1000);

            expect(result.textContent).to.equal('');
        });

        it('renders empty; when value currency symbol both undefined', () => {
            const result = wrap({ currencyCode: 'idk' });

            expect(result.textContent).to.equal('');
        });
    });

    describe('Happy case', () => {
        it('renders currency symbol and price value', () => {
            const result = wrap({ value: 999, currencyCode: 'gbp' });

            expect(result.textContent).to.equal('£9.99');
        });

        it('renders FREE when value is zero', () => {
            const result = wrap({ value: 0, currencyCode: 'gbp' });

            expect(result.textContent).to.equal('FREE');
        });

        it('renders 0.00 when value is \'zero\'', () => {
            const result = wrap({ value: '0', currencyCode: 'gbp' });

            expect(result.textContent).to.equal('£0.00');
        });
    });

    describe('Partial case', () => {
        it('renders currency symbol with &middot; when value is undefined', () => {
            const result = wrap({ currencyCode: 'gbp' });

            expect(result.textContent).to.equal('£ &middot;');
        });

        it('renders currencyCode; when currency symbol is undefined', () => {
            const result = PriceDisplay({ currencyCode: 'idk', value: 999 });

            expect(result.textContent).to.equal('9.99idk');
        });
    });
});

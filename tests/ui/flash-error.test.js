import flashError from '/templates/hotel-booking/helpers/flash-error.js';

describe('flash-error', () => {
    let flashErrorEl;
    let flash;

    beforeEach(() => {
        flashErrorEl = document.createElement('div');
        flashErrorEl.className = 'sdk-app-bundle-layout-flash-error';
        document.body.appendChild(flashErrorEl);
        flash = flashError('');
    });

    afterEach(() => {
        flashErrorEl.remove();
    });

    it('appends nothing by default', () => {
        expect(flashErrorEl.querySelector('.flash-error')).to.equal(null);
    });

    it('appends the flash error to the flash-error element when show is called', () => {
        flash.show();

        expect(flashErrorEl.querySelector('.flash-error')).instanceof(HTMLElement);
    });

    it('removes the flash error from the flash-error element when hide is called', () => {
        flash.show();
        flash.hide();

        expect(flashErrorEl.querySelector('.flash-error')).to.equal(null);
    });
});

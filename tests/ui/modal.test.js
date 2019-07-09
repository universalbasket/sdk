import createModal from '/src/builtin-templates/modal.js';

describe('modal', () => {
    let $modal;

    beforeEach(() => {
        $modal = document.createElement('div');
        $modal.id = 'modal';

        document.body.appendChild($modal);
    });

    afterEach(() => {
        $modal.remove();
    });

    it('does nothing when given no content', () => {
        createModal().show();

        expect($modal.children.length).to.equal(0);
    });

    it('renders a given DOM element within a wrapper', () => {
        const el = document.createElement('p');

        createModal(el).show();

        const wrapper = $modal.querySelector('.modal-wrapper');

        expect(wrapper).instanceof(HTMLDivElement);

        expect(wrapper.contains(el)).to.equal(true);
    });

    it('renders a given title to an h2 element in the wrapper', () => {
        const el = document.createElement('p');

        createModal(el, { title: 'a title' }).show();

        const header = $modal.querySelector('.modal-wrapper h2');

        expect(header.textContent).to.equal('a title');
    });


    it('does not add the "modal-wrapper--hidden" class when the hidden option to show is not truthy', () => {
        const el = document.createElement('p');

        createModal(el).show();

        const wrapper = $modal.querySelector('.modal-wrapper');

        expect(wrapper.classList.contains('modal-wrapper--hidden')).to.equal(false);
    });

    it('adds the "modal-wrapper--hidden" class when the hidden option to show is truthy', () => {
        const el = document.createElement('p');

        createModal(el).show({ hidden: true });

        const wrapper = $modal.querySelector('.modal-wrapper');

        expect(wrapper.classList.contains('modal-wrapper--hidden')).to.equal(true);
    });

    it('removes the modal content when close is called', () => {
        const el = document.createElement('p');

        const modal = createModal(el);

        modal.show();
        modal.close();

        expect($modal.innerHTML).to.equal('');
    });

    it('removes the modal when the overlay element is clicked', () => {
        const el = document.createElement('p');

        createModal(el).show({ hidden: true });

        $modal.querySelector('.modal-wrapper__overlay').click();

        expect($modal.innerHTML).to.equal('');
    });

    it('removes the modal when the close button is clicked', () => {
        const el = document.createElement('p');

        createModal(el).show({ hidden: true });

        $modal.querySelector('.modal__close').click();

        expect($modal.innerHTML).to.equal('');
    });
});

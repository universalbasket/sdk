import { html } from '/web_modules/lit-html/lit-html.js';
import createModal from '@/src/builtin-templates/modal.js';

describe('Modal UI', () => {
    it('has empty templateResult when no args passed', () => {
        const modal = createModal();
        expect(modal).toEqual(expect.objectContaining({
            close: expect.any(Function),
            fake: expect.any(Function),
            templateResult: undefined
        }));
    });

    it('renders a string', () => {
        const string = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>';
        const modal = createModal(string);
        expect(modal.templateResult.values).toContain(string);
    });

    it('renders template result', () => {
        const HTML = html`<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>`;
        const modal = createModal(HTML);
        expect(modal.templateResult.values).toContain(HTML);
    });

    it('renders template result and title', () => {
        const HTML = html`<p>Lorem ipsum dolor sit amet.</p>`;
        const modal = createModal(HTML, { title: 'title' });

        expect(modal.templateResult.values)
            .toEqual(expect.arrayContaining([
                expect.objectContaining({
                    values: expect.arrayContaining(['title'])
                }),
                HTML
            ]));
    });

    it('renders with .modal--locked', () => {
        const HTML = html`<p>Lorem ipsum dolor sit amet.</p>`;
        const modal = createModal(HTML, { title: 'title', isLocked: true });

        expect(modal.templateResult.values)
            .toEqual(expect.arrayContaining([
                'modal--locked',
                expect.objectContaining({
                    values: expect.arrayContaining(['title']),
                    type: 'html'
                }),
                HTML
            ]));
    });
});

import { getAll as storageGetAll } from './storage.js';

const desktopSelector = '.sdk-app-bundle-layout-summary-desktop';
const mobileSelector = '.sdk-app-bundle-layout-summary-mobile';

export default class Summary {
    constructor(sdk) {
        this.sdk = sdk;
        this.bodyTemplate = null;
    }

    setTemplate(template, isMobile) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        this.bodyTemplate = template;
        this.currentTarget = document.querySelector(isMobile ? mobileSelector : desktopSelector);
        this.prevTarget = document.querySelector(!isMobile ? mobileSelector : desktopSelector);

        this.update();

        window.addEventListener('update', () => this.update());
    }

    update() {
        if (this.bodyTemplate) {
            const { input: inputs, output: outputs, cache, _ } = storageGetAll();

            while (this.currentTarget.lastChild) {
                this.currentTarget.removeChild(this.currentTarget.lastChild);
            }

            this.currentTarget.appendChild(this.bodyTemplate({ inputs, outputs, cache, sdk: this.sdk, _ }));

            while (this.prevTarget.lastChild) {
                this.prevTarget.removeChild(this.prevTarget.lastChild);
            }
        }
    }
}

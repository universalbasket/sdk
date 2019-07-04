import { render } from '/web_modules/lit-html/lit-html.js';
import * as Storage from './storage.js';

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
        this.currentTarget = document.querySelector(isMobile ? '#summary-mobile' : '#summary-desktop');
        this.prevTarget = document.querySelector(!isMobile ? '#summary-mobile' : '#summary-desktop');

        this.update();

        window.addEventListener('update', () => this.update());
    }

    update() {
        if (this.bodyTemplate) {
            const { inputs, outputs, cache, _ } = Storage.getAll();

            render(this.bodyTemplate({ inputs, outputs, cache, sdk: this.sdk, _ }), this.currentTarget);

            this.prevTarget.innerHTML = '';
        }
    }
}

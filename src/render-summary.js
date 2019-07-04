import { render } from '/web_modules/lit-html/lit-html.js';
import * as Storage from './storage.js';

function updateUi() {
    if (this.bodyTemplate) {
        const { inputs, outputs, cache, _ } = Storage.getAll();

        render(this.bodyTemplate({ inputs, outputs, cache, sdk: this.sdk, _ }), this.currentTarget);
        render('', this.prevTarget);
    }
}

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

        updateUi.call(this);

        window.addEventListener('update', () => updateUi.call(this));
    }

    update() {
        if (!this.bodyTemplate) {
            throw new Error('renderSummary: not initiated');
        }

        updateUi.call(this);
    }
}

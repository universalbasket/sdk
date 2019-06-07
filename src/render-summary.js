import { render } from '/web_modules/lit-html/lit-html.js';
import summaryWrapper from './builtin-templates/summary-wrapper.js';
import * as Storage from './storage.js';

let bodyTemplate = null;
let initiated = false;

export default {
    init({ template, selector = '#summary' }) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        const wrapper = document.querySelector(selector);
        if (!wrapper) {
            throw new Error(`renderSummary: element ${selector} not found`);
        }

        bodyTemplate = template;

        render(summaryWrapper(), wrapper);
        initiated = true;
    },

    update() {
        if (!initiated || !bodyTemplate) {
            throw new Error('renderSummary: not initiated');
        }
        const { inputs, outputs, cache, local } = Storage.getAll();
        render(bodyTemplate(inputs, outputs, cache, local), document.querySelector('#summary-body'));
    }
};

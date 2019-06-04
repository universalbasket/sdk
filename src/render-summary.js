import { render } from 'lit-html';
import summaryWrapper from './builtin-templates/summary-wrapper'
import * as Storage from './storage';

let bodyTemplate = null;
let initiated = false;

export default {
    init: ({ template, selector = '#summary' }) => {
        if (!template || typeof template !== 'function') {
            throw new Error(`renderSummary: invalid template`);
        }

        const wrapper = document.querySelector(selector);
        if (!wrapper) {
            throw new Error(`renderSummary: element ${selector} not found`);
        }

        bodyTemplate = template;

        render(summaryWrapper(), wrapper);
        initiated = true;
    },

    update: () => {
        if (!initiated || !bodyTemplate) {
            throw new Error('renderSummary: not initiated');
        }
        const { inputs, outputs, cache, local } = Storage.getAll();
        render(bodyTemplate(inputs, outputs, cache, local), document.querySelector('#summary-body'));
    }
}

import { render } from '/web_modules/lit-html/lit-html.js';
import * as Storage from './storage.js';

let bodyTemplate = null;
let initiated = false;
let currentTarget, prevTarget;

export default {
    init(template, isMobile) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        bodyTemplate = template;
        currentTarget = document.querySelector(isMobile ? '#summary-mobile' : '#summary-desktop');
        prevTarget = document.querySelector(!isMobile ? '#summary-mobile' : '#summary-desktop');

        _updateUI();
        window.addEventListener('update', _updateUI);

        initiated = true;
    },

    update() {
        if (!initiated || !bodyTemplate) {
            throw new Error('renderSummary: not initiated');
        }

        _updateUI();
    }
};

function _updateUI() {
    if (!initiated) {
        return;
    }

    const { inputs, outputs, cache, local, _ } = Storage.getAll();
    render(bodyTemplate(inputs, outputs, cache, local, _), currentTarget);
    render('', prevTarget);
}

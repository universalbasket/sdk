import { render } from '/web_modules/lit-html/lit-html.js';
import modal from './builtin-templates/modal.js';

import * as Storage from './storage.js';

let BodyTemplate = null;
let initiated = false;
let currentTarget, prevTarget;

export default {
    init(template, isMobile) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        BodyTemplate = template;
        currentTarget = document.querySelector(isMobile ? '#summary-mobile' : '#summary-desktop');
        prevTarget = document.querySelector(!isMobile ? '#summary-mobile' : '#summary-desktop');

        _updateUI();
        window.addEventListener('update', _updateUI);
        window.addEventListener('show-modal', showModal);

        initiated = true;
    },

    update() {
        if (!initiated || !BodyTemplate) {
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
    render(BodyTemplate(inputs, outputs, cache, local, _), currentTarget);
    render('', prevTarget);
}

function showModal({ detail }) {
    const template = modal.create(...detail);
    modal.show(template);
}

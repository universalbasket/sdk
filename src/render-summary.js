import { render } from '/web_modules/lit-html/lit-html.js';
import modal from './builtin-templates/modal.js';

import * as Storage from './storage.js';

let BodyTemplate = null;
let initiated = false;

export default {
    init(template) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        BodyTemplate = template;

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
    render(BodyTemplate(inputs, outputs, cache, local, _), document.querySelector('#summary'));
}

function showModal({ detail }) {
    render(modal(...detail), document.querySelector('#modal'));
}

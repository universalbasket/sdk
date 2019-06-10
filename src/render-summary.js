import { render } from '/web_modules/lit-html/lit-html.js';
import modal from './builtin-templates/modal.js';
import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js';
import * as Storage from './storage.js';

let BodyTemplate = null;
let wrapper = null;

let initiated = false;
let isExpanded = true;
let isMobile = false;

export default {
    init({ template, selector = '#summary' }) {
        if (!template || typeof template !== 'function') {
            throw new Error('renderSummary: invalid template');
        }

        wrapper = document.querySelector(selector);
        if (!wrapper) {
            throw new Error(`renderSummary: element ${selector} not found`);
        }

        BodyTemplate = template;
        _updateUI();

        window.addEventListener('toggle-summary', () => toggleSummary());
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
    const el = document.querySelector('#summary');
    render(BodyTemplate(inputs, outputs, cache, local, _, isMobile, isExpanded), el);
}

installMediaQueryWatcher('(max-width: 650px)', match => {
    isExpanded = !match;
    isMobile = match;
    _updateUI();
});

function toggleSummary() {
    isExpanded = !isExpanded;
    _updateUI();
}

function showModal({ detail }) {
    render(modal(...detail), document.querySelector('#modal'));
}

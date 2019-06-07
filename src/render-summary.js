import { html, render } from '/web_modules/lit-html/lit-html.js';
import summaryWrapper from './builtin-templates/summary-wrapper.js'
import modal from './builtin-templates/modal.js'
import { installMediaQueryWatcher } from '/web_modules/pwa-helpers/media-query.js'
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

        const data = Storage.getAll();

        render(summaryWrapper({ isExpanded, isMobile, ...data }), wrapper);

        window.addEventListener('toggle-summary', () => toggleSummary(wrapper));
        window.addEventListener('show-modal', showModal);
        initiated = true;
    },

    update() {
        if (!initiated || !BodyTemplate) {
            throw new Error('renderSummary: not initiated');
        }

        const { inputs, outputs, cache, local} = Storage.getAll();

        _updateDetails(inputs, outputs, cache, local);
    }
};

function _updateDetails(inputs, outputs, cache, local) {
    const el = document.querySelector('#summary-body');
    el && render(BodyTemplate(inputs, outputs, cache, local), el);
}

function _updateUI() {
    if (!initiated) {
        return;
    }

    const { inputs, outputs, cache, local, _ } = Storage.getAll();
    render(summaryWrapper({ isExpanded, isMobile, inputs, outputs, cache, local, _ }), wrapper);
    _updateDetails(inputs, outputs, cache, local);
}

installMediaQueryWatcher(
  '(max-width: 650px)',
  match => {
    isExpanded = !match;
    isMobile = match;
    _updateUI();
  }
);

function toggleSummary(wrapper) {
    isExpanded = !isExpanded;
    _updateUI();
}

function showModal({ detail }) {
    render(modal(...detail), document.querySelector('#modal'));
}

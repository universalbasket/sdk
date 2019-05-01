'use strict';

export default class FlowManager {
    constructor(meta) {
        this.sections = meta.map(f => f.name);
        this.meta = meta;
        this.currentSection = null;
        this.history = [];
    }

    init() {
        if (!Array.isArray(this.sections)) {
            console.error('Invalid Flow is given');
            throw new Error('Invalid Flow is given');
        }

        this.next();
    }

    next() {
        const next = this.sections.shift();

        if (!next) {
            return null;
        }

        this.currentSection = next;
        this.history.push(next);
    }

    previous() {
        if (this.history.length < 2) {
            return null;
        }

        const currentSectionIdx = this.history.indexOf(this.currentSection);
        const previous = this.history[currentSectionIdx];

        this.sections.unshift([this.currentSection]);
        this.currentSection = previous;
        this.history.splice(currentSectionIdx);
    }

    getCurrentSection() {
        return this.currentSection;
    }

    getMeta(name) {
        return this.meta.find(m => m.name === name) || null;
    }
}

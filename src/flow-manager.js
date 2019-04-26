'use strict';

export default class FlowManager {
    constructor(meta) {
        this.steps = meta.map(f => f.key);
        this.meta = meta;
        this.currentKey = null;
        this.history = [];
    }

    init() {
        if (!Array.isArray(this.steps)) {
            console.error('Invalid Flow is given');
            throw new Error('Invalid Flow is given');
        }

        this.next();
    }

    next() {
        const next = this.steps.shift();

        if (!next) {
            return null;
        }

        this.currentKey = next;
        this.history.push(next);
    }

    previous() {
        if (this.history.length < 2) {
            return null;
        }

        const currentKeyIdx = this.history.indexOf(this.currentKey);
        const previous = this.history[currentKeyIdx];

        this.steps.unshift([this.currentKey]);
        this.currentKey = previous;
        this.history.splice(currentKeyIdx);
    }

    getCurrentKey() {
        return this.currentKey;
    }

    getMeta(key) {
        return this.meta.find(m => m.key === key) || null;
    }

}

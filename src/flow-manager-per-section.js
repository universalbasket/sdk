'use strict';

export default class FlowManager {
    constructor(meta) {
        this.meta = meta;
        this.currentInputKey = null;
        this.inputKeys = meta.map(m => m.inputKey);
        this.history = [];

        this.init();
    }

    init() {
        if (!Array.isArray(this.inputKeys)) {
            console.error('Invalid Flow is given');
            throw new Error('Invalid Flow is given');
        }

        this.next();
    }

    next() {
        const next = this.inputKeys.shift();

        if (!next) {
            return null;
        }

        this.currentInputKey = next;
        this.history.push(next);
    }

    previous() {
        if (this.history.length < 2) {
            return null;
        }

        const currentInputKeyIdx = this.history.indexOf(this.currentInputKey);
        const previous = this.history[currentInputKeyIdx];

        this.inputKeys.unshift([this.currentInputKey]);
        this.currentInputKey = previous;
        this.history.splice(currentInputKeyIdx);
    }

    getCurrentInputKey() {
        return this.currentInputKey;
    }

    getCurrentMeta() {
        const inputKey = this.currentInputKey;
        return this.meta.find(m => m.inputKey === inputKey) || null;
    }
}

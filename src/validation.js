import { TYPES as storageTypes } from './storage.js';

export function pages(pagesConfig) {
    if (!pagesConfig || !pagesConfig.length) {
        throw new Error('No pages configured.');
    }

    for (const { name, title, sections, route } of pagesConfig) {
        if (typeof name !== 'string') {
            throw new Error('The name of a page was not found.');
        }

        if (typeof title !== 'string') {
            throw new Error(`The title of page ${name} was not found.`);
        }

        if (typeof route !== 'string') {
            throw new Error(`The route of page ${name} was not found.`);
        }

        if (!Array.isArray(sections) || sections.length === 0) {
            throw new Error(`The sections of page ${name} were not found or empty.`);
        }

        for (const { name: sectionName, template, waitFor = [] } of sections) {
            if (!template) {
                throw new Error(`Template for page ${name} section ${sectionName} not found.`);
            }

            const waitForValid = Array.isArray(waitFor) && waitFor.every(element => {
                const [type, key] = element.split('.');

                return typeof type === 'string' && typeof key === 'string' && storageTypes.includes(type);
            });

            if (!waitForValid) {
                throw new Error(`waitFor config for page ${name} section ${sectionName} must be an array of strings beginning with a known type.`);
            }
        }
    }
}

export function cache(cacheConfig) {
    if (!Array.isArray(cacheConfig)) {
        throw new Error('Configuration for cache must be an array.');
    }

    for (const { key, sourceInputKeys, variabilityThreshold = 0 } of cacheConfig) {
        if (typeof key !== 'string' || !key) {
            throw new Error('Cache configuration elements have key fields with a non-zero length string as a value.');
        }

        const sourceInputKeysValid = Array.isArray(sourceInputKeys) && sourceInputKeys.every(key => typeof key === 'string');

        if (!sourceInputKeysValid) {
            throw new Error('Cache sourceInputKeys must be arrays with string elements.');
        }

        if (isNaN(variabilityThreshold) || variabilityThreshold < 0 || variabilityThreshold > 1) {
            throw new Error('When defined, cache variabilityThreshold must be a number between 0 and 1 (inclusive).');
        }
    }
}

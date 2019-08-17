'use strict';

const pluginImport = require('postcss-import');
const defaultResolve = require('postcss-import/lib/resolve-id');

module.exports = {
    plugins: [
        pluginImport({
            from: './src',
            resolve(id, base, options) {
                return defaultResolve(id.startsWith('/') ? `..${id}` : id, base, options);
            }
        })
    ]
};

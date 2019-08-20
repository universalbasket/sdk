'use strict';

module.exports = {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'ubio-bundle'
    },
    plugins: [{
        name: 'resolve-absolute-modules',
        resolveId(source) {
            return source.startsWith('/') ? source.slice(1) : null;
        }
    }]
};

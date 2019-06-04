export default {
    input: 'index.js',
    output: {
        file:'bundle.js',
        format: 'umd',
        name: 'UBIO_BUNDLE'
    },
    plugins: [{
        name: 'resolve-absolute-modules',
        resolveId(source) {
            return source.startsWith('/') ? source.slice(1) : null;
        }
    }]
};

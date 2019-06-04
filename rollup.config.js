const alias = require('rollup-plugin-alias');
const p = require('./package');
const aliases = {};

for (const m of [...p['@pika/web'].webDependencies, ...p['hack-wrap']]) {
    aliases[`/web_modules/${m}.js`] = `web_modules/${m}.js`;
}

module.exports = {
    input: 'index.js',
    output: {
        file:'bundle.js',
        format: 'umd',
        name: 'UBIO_BUNDLE'
    },
    plugins: [
        alias(aliases)
    ]
};

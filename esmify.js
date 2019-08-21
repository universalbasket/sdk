'use strict';

/* env: node */

const p = require('./package');
const { join } = require('path');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

async function wrapPackage(name) {
    const bundle = await rollup.rollup({
        input: require.resolve(name),
        plugins: [
            resolve(),
            commonjs()
        ]
    });

    const file = join(__dirname, 'web_modules', `${name}.js`);

    await bundle.write({ file, format: 'es', sourcemap: true });

    console.log(`Built ${file}`);
}

for (const name of p['esmify']) {
    wrapPackage(name);
}

#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const cpy = require('cpy');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const pkg = require('./package.json');
const domains = ['broadband-signup', 'hotel-booking', 'pet-insurance'];
const args = process.argv.slice(1);

async function run() {
    const domainIndex = args.indexOf('--domain');

    if (domainIndex === -1) {
        throw new Error('The --domain flag must be used to select a domain for your new project.');
    }

    const domain = args[domainIndex + 1];

    if (!domains.includes(domain)) {
        throw new Error('A domain name must follow the --domain flag in order select a domain for your new project.');
    }

    const nameIndex = args.indexOf('--name');

    if (nameIndex === -1) {
        throw new Error('The --name flag must be used to give your new project a name.');
    }

    const name = args[nameIndex + 1];

    if (!name || name.startsWith('-')) {
        throw new Error('A valid domain name must follow the --name flag in order to name your new project.');
    }

    await fs.mkdir(name);

    process.chdir(name);

    await fs.writeFile('package.json', JSON.stringify({
        name: 'project-template',
        version: '1.0.0',
        description: '',
        main: 'index.js',
        private: true,
        scripts: {
            install: 'rimraf web_modules && vendor-copy',
            test: 'echo \'Error: no test specified\' && exit 1'
        },
        dependencies: {
            '@ubio/sdk-application-bundle': `^${pkg.version}`,
            // '@ubio/sdk-application-bundle': '..',
            'lit-html': pkg.dependencies['lit-html'],
            'vendor-copy': pkg.dependencies['vendor-copy'],
            'rimraf': pkg.dependencies['rimraf']
        },
        vendorCopy: [
            {
                from: 'node_modules/lit-html',
                to: 'web_modules/lit-html'
            },
            {
                from: `node_modules/@ubio/sdk-application-bundle/${pkg.module}`,
                to: 'web_modules/@ubio/sdk-application-bundle.js'
            }
        ]
    }, null, 2));

    await exec('npm i');
    await cpy(path.join(__dirname, 'templates', domain), domain);
    await cpy(path.join(__dirname, 'templates', 'generic'), 'generic');
    await fs.copyFile(path.join(__dirname, 'templates', `${domain}.config.js`), 'ubio.config.js');

    await fs.writeFile('index.js', `import { createApp } from './src/main.js';
import CONFIG from './ubio.config.js';

const app = createApp(CONFIG, () => console.log('finished!'));
app.init();
`);
}

run();

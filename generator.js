#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const copy = require('recursive-copy');
const replaceInFiles = require('replace-in-files');
const pkg = require('./package.json');
const domains = ['broadband-signup', 'hotel-booking', 'pet-insurance'];
const args = process.argv.slice(1);

function getArgs() {
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

    return { name, domain };
}

async function run() {
    const { name, domain } = getArgs();

    process.stdout.write('Copying project template...');
    await copy(path.join(__dirname, 'application-template'), name, { dot: true });
    process.stdout.write(' ✓\n');

    process.chdir(name);

    const cwd = process.cwd();

    process.stdout.write('Creating package file...');
    await fs.writeFile('package.json', JSON.stringify({
        name,
        version: '1.0.0',
        description: '',
        main: 'public/index.js',
        private: true,
        scripts: {
            prepare: 'pika-web --clean',
            start: 'node -r dotenv/config serve.js',
            test: 'echo \'Error: no test specified\' && exit 1',
            lint: 'eslint .',
            build: 'rollup -c && postcss src/index.css -o dist/bundle.css'
        },
        dependencies: {
            '@pika/web': pkg.devDependencies['@pika/web'],
            '@ubio/sdk': `^${pkg.version}`,
            '@ubio/client-library': pkg.devDependencies['@ubio/client-library'],
            'lit-html': pkg.devDependencies['lit-html']
        },
        devDependencies: {
            'body-parser': pkg.devDependencies['body-parser'],
            cors: pkg.devDependencies.cors,
            dotenv: pkg.devDependencies.dotenv,
            eslint: pkg.devDependencies.eslint,
            'eslint-config-ub': pkg.devDependencies['eslint-config-ub'],
            express: pkg.devDependencies.express,
            'node-fetch': pkg.devDependencies['node-fetch'],
            'postcss-cli': pkg.devDependencies['postcss-cli'],
            'postcss-import': pkg.devDependencies['postcss-import'],
            rollup: pkg.devDependencies.rollup
        },
        '@pika/web': {
            'webDependencies': [
                '@ubio/client-library',
                '@ubio/sdk',
                '@ubio/sdk/index.css',
                'lit-html/lit-html.js',
                'lit-html/directives/*.js'
            ]
        }
    }, null, 2));
    process.stdout.write(' ✓\n');

    process.stdout.write('Running npm install...');
    await exec('npm i', { env: process.env });
    process.stdout.write(' ✓\n');

    process.stdout.write('Copying templates...');
    await copy(path.join(__dirname, 'templates', domain), path.join(cwd, 'public', 'templates'));
    await replaceInFiles({
        files: ['public/**/*.js'],
        from: /\/src\/main.js/g,
        to: '/web_modules/@ubio/sdk.js'
    });
    process.stdout.write(' ✓\n');

    process.stdout.write('Reticulating splines...');
    await new Promise(r => setTimeout(r, 250));
    process.stdout.write(' ✓\n');

    process.stdout.write('Copying config file...');
    await fs.copyFile(path.join(__dirname, 'templates', `${domain}.config.js`), path.join(cwd, 'public', 'ubio.config.js'));
    await replaceInFiles({
        files: ['public/ubio.config.js'],
        from: new RegExp(`/${domain}/`, 'g'),
        to: '/templates/'
    });
    process.stdout.write(' ✓\n');

    console.log('Project created in directory:', cwd);
}

run();

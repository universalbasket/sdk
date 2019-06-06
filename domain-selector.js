'use strict';

const { readdirSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

const domain = process.argv[2];
if (!readdirSync(path.join(__dirname, 'templates')).includes(domain)) {
    console.error('ERROR:', `./templates/${domain} does not exist`);
    process.exit(1);
}

const indexExampleFile = path.join(__dirname, 'index.example.js');
const indexJsFile = path.join(__dirname, 'index.js');

const text = readFileSync(indexExampleFile, 'utf-8');
const patched = text
    .replace(/\$DOMAIN/g, domain);

writeFileSync(indexJsFile, patched, 'utf-8');

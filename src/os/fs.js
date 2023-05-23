const { readdirSync, existsSync } = require('node:fs');
const { join, extname } = require('node:path');

const { debug } = require('../utils/log');

function validateFolderExists(path) {
    if (!existsSync(path)) {
        throw new Error(`${path} does not exist on the current file system`);
    }
}

function getTestsList() {
    const { WARTHOG_TESTS_PATH: path } = process.env;

    if (!path) {
        throw new Error(`WARTHOG_TESTS_PATH is ${path}`)
    }
    validateFolderExists(path);

    const tests = readdirSync(path)
        .filter(file => {
            return extname(file) === '.js'
        })
        .map(file => {
            return join(path, file)
        });
    debug('fs', `Loaded scripts: ${tests}`);
    return tests;
}

module.exports = {
    getTestsList
}
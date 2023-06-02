const { writeFileSync, mkdirSync } = require('node:fs');
const { getTestsList } = require('./fs');
const rimraf = require('rimraf');

describe('detect script to execute', () => {
    beforeAll(() => rimraf.sync('.tmp/'));

    describe('should fail', () => {
        it('should throw an error if there is no config about it', () => {
            expect(getTestsList).toThrow('WARTHOG_TESTS_PATH is undefined');
        });

        it('should throw an error if the path does not exists', () => {
            process.env.WARTHOG_TESTS_PATH = '.tmp/';
            expect(getTestsList).toThrow(`".tmp/" does not exist on the current file system`);
        });
    });

    describe('should not fail', () => {
        it('should return a list of all the tests on the from the config folder', () => {
            mkdirSync('.tmp');
            writeFileSync('.tmp/script_1.js', '');
            expect(getTestsList()).toEqual(['.tmp/script_1.js']);
        });
    });
});

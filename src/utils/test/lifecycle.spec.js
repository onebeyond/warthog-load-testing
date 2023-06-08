const { resolve: pathResolve } = require('node:path');
const { validate } = require('./lifecycle');

describe('should fail', () => {
    describe('detect malformed test section', () => {
        it('stages', async () => {
            const testPath = pathResolve(
                __dirname,
                '../../../test/fixtures/tests/malformed/missing-setup.js'
            );

            expect(() => {
                validate.byTestPath(testPath).setup();
            }).toThrow('"setup" function must be defined');
        });

        it('setup', async () => {
            const testPath = pathResolve(
                __dirname,
                '../../../test/fixtures/tests/malformed/missing-setup.js'
            );

            expect(() => {
                validate.byTestPath(testPath).setup();
            }).toThrow('"setup" function must be defined');
        });

        it('test', async () => {
            const testPath = pathResolve(
                __dirname,
                '../../../test/fixtures/tests/malformed/missing-test.js'
            );

            expect(() => {
                validate.byTestPath(testPath).test();
            }).toThrow('"test" function must be defined');
        });
    });
});

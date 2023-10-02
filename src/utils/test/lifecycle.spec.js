const { resolve: pathResolve } = require('node:path');
const { validate } = require('./lifecycle');

describe('should fail', () => {
    describe('missing test section', () => {
        it('stages', async () => {
            const testPath = './test/fixtures/tests/missing/stages.js';

            expect(() => {
                validate.byTestPath(testPath).stages();
            }).toThrow('Test "stages" is not an array');
        });

        it('setup', async () => {
            const testPath = './test/fixtures/tests/missing/setup.js';

            expect(() => {
                validate.byTestPath(testPath).setup();
            }).toThrow('"setup" function must be defined');
        });

        it('test', async () => {
            const testPath = './test/fixtures/tests/missing/test.js';

            expect(() => {
                validate.byTestPath(testPath).test();
            }).toThrow('"test" function must be defined');
        });

        it('expect', async () => {
            const testPath = './test/fixtures/tests/missing/expect.js';

            expect(() => {
                validate.byTestPath(testPath).expect();
            }).toThrow('Expect is not an object "undefined"');
        });
    });

    describe('malformed test section', () => {
        describe('stages', () => {
            it('iterations', async () => {
                const testPath = './test/fixtures/tests/malformed/stages/iterations.js';

                expect(() => {
                    validate.byTestPath(testPath).stages();
                }).toThrow('Stage "iteration" is not a number "1"');
            });

            it('seconds', async () => {
                const testPath = './test/fixtures/tests/malformed/stages/seconds.js';

                expect(() => {
                    validate.byTestPath(testPath).stages();
                }).toThrow('Stage "seconds" is not a number "1"');
            });
        });
    });
});

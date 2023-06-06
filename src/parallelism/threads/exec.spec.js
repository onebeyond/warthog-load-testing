describe('Execute test exports', () => {
    describe('should fail', () => {
        describe('detect malformed test section', () => {
            it('setup', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/malformed/missing-setup.js'
                    );

                    return {
                        workerData: {
                            path: test
                        }
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('"setup" function must be defined');
            });

            it('test', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/malformed/missing-test.js'
                    );

                    return {
                        workerData: {
                            path: test
                        }
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('"test" function must be defined');
            });

            it('iterations', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/malformed/missing-iterations.js'
                    );

                    return {
                        workerData: {
                            path: test
                        }
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow(
                    'Test iterations "undefined" is not valid'
                );
            });
        });

        describe('handle thrown error', () => {
            it('setup', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/errors/setup-throwing.js'
                    );

                    return {
                        workerData: {
                            path: test
                        }
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('Custom forced error');
            });
        });
    });
});

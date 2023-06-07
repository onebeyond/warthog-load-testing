const EventEmitter = require('node:events');

describe('Execute test exports', () => {
    const mocks = {
        node: {
            parentPort: {
                on: jest.fn(() => {}),
                postMessage: jest.fn(() => {})
            }
        }
    };

    class MockParentPortEventEmitter extends EventEmitter {
        on(event, ...args) {
            mocks.node.parentPort.on(event, ...args);
        }
    }

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
                        },
                        parentPort: new MockParentPortEventEmitter()
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
                        },
                        parentPort: new MockParentPortEventEmitter()
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('"test" function must be defined');
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
                        },
                        parentPort: new MockParentPortEventEmitter()
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('Custom forced error');
                expect(mocks.node.parentPort.on).toHaveBeenCalledTimes(1);
                expect(mocks.node.parentPort.postMessage).toHaveBeenCalledTimes(0);
            });

            it.skip('test', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/errors/test-throwing.js'
                    );

                    return {
                        workerData: {
                            path: test
                        },
                        parentPort: {
                            postMessage: mocks.node.parentPort
                        }
                    };
                });

                const { executeChild } = require('./exec');
                await expect(executeChild()).rejects.toThrow('Custom forced error');
                expect(mocks.node.parentPort).toHaveBeenCalledTimes(1);
                expect(mocks.node.parentPort).toHaveBeenCalledWith({
                    iteration: {}
                });
            });
        });
    });
});

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

        postMessage(value) {
            mocks.node.parentPort.postMessage(value);
        }
    }

    describe('should fail', () => {
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

                const { createChild } = require('./manage');
                await expect(createChild()).rejects.toThrow('Custom forced error');
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

                const { createChild } = require('./manage');
                await expect(createChild()).rejects.toThrow('Custom forced error');
                expect(mocks.node.parentPort).toHaveBeenCalledTimes(1);
                expect(mocks.node.parentPort).toHaveBeenCalledWith({
                    iteration: {}
                });
            });
        });
    });

    describe('should not fail', () => {
        it('setup', async () => {
            jest.mock('node:worker_threads', () => {
                const { resolve: pathResolve } = require('node:path');

                const test = pathResolve(__dirname, '../../../test/fixtures/tests/working/void.js');

                return {
                    workerData: {
                        path: test
                    },
                    parentPort: new MockParentPortEventEmitter()
                };
            });

            const { createChild } = require('./manage');
            await expect(createChild).not.toThrow();
            expect(mocks.node.parentPort.on).toHaveBeenCalledTimes(1);
            expect(mocks.node.parentPort.postMessage).toHaveBeenCalledWith({ setupFinished: true });
        });
    });
});

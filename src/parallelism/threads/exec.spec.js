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

    beforeEach(() => {
        // Some tests are setting the var manually and it's not going to be cleared automatically
        // since it's out of the scope of the mock. Without clearing this you can go creazy :)
        delete process.env.WARTHOG_END;
    });

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

            it('test', async () => {
                jest.mock('node:worker_threads', () => {
                    const { resolve: pathResolve } = require('node:path');

                    const test = pathResolve(
                        __dirname,
                        '../../../test/fixtures/tests/working/end-signal.js'
                    );

                    return {
                        workerData: {
                            path: test,
                            iterations: require(test).stages[0].iterations
                        },
                        parentPort: new MockParentPortEventEmitter()
                    };
                });

                const { createChild } = require('./manage');
                await createChild();
                expect(mocks.node.parentPort.on).toHaveBeenCalledTimes(1);
                expect(mocks.node.parentPort.postMessage.mock.calls).toEqual([
                    [
                        {
                            setupFinished: true
                        }
                    ],
                    // We indicated two iterations to be done for this test every second
                    // Since the test is setting the variable for stoping the second loop no more
                    // than this two instances of the test function would be executed.
                    [{ iteration: { duration: expect.any(Number) } }],
                    [{ iteration: { duration: expect.any(Number) } }]
                ]);
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

        it('test', async () => {
            jest.mock('node:worker_threads', () => {
                const { resolve: pathResolve } = require('node:path');

                const test = pathResolve(
                    __dirname,
                    '../../../test/fixtures/tests/working/end-signal.js'
                );

                return {
                    workerData: {
                        path: test,
                        iterations: require(test).stages[0].iterations
                    },
                    parentPort: new MockParentPortEventEmitter()
                };
            });

            const { createChild } = require('./manage');
            await createChild();
            expect(mocks.node.parentPort.on).toHaveBeenCalledTimes(1);
            expect(mocks.node.parentPort.postMessage.mock.calls).toEqual([
                [
                    {
                        setupFinished: true
                    }
                ],
                // We indicated two iterations to be done for this test every second
                // Since the test is setting the variable for stoping the second loop no more
                // than this two instances of the test function would be executed.
                [{ iteration: { duration: expect.any(Number) } }],
                [{ iteration: { duration: expect.any(Number) } }]
            ]);
        });
    });
});

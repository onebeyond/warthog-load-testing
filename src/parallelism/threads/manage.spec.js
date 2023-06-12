describe('threads management', () => {
    const mocks = {
        processCommunication: {
            subscribeParent: jest.fn(() => {})
        },
        exec: {
            executeLifecycle: {
                setup: jest.fn(() => {}),
                test: jest.fn(() => {})
            }
        }
    };

    beforeEach(() => {
        jest.mock('node:worker_threads', () => ({
            workerData: {
                path: '/jest'
            }
        }));

        jest.mock('./process-communication', () => ({
            subscribeParent: mocks.processCommunication.subscribeParent
        }));

        jest.mock('./exec', () => ({
            executeLifecycle: {
                setup: mocks.exec.executeLifecycle.setup,
                test: mocks.exec.executeLifecycle.test
            }
        }));

        jest.mock('../../utils/test/lifecycle', () => ({
            validate: {
                byTestPath: () => ({
                    setup: jest.fn(() => 'setup finished'),
                    test: jest.fn(() => 'test finished')
                })
            }
        }));
    });

    it('create child from parent', async () => {
        const { createChild } = require('./manage');
        await createChild();

        const { workerData } = require('node:worker_threads');
        expect(workerData).toEqual({
            path: '/jest',
            testLifecycle: {
                setup: 'setup finished',
                test: 'test finished'
            }
        });

        expect(mocks.processCommunication.subscribeParent).toHaveBeenCalledTimes(1);

        expect(mocks.exec.executeLifecycle.setup).toHaveBeenCalledTimes(1);
        expect(mocks.exec.executeLifecycle.test).toHaveBeenCalledTimes(1);
    });
});

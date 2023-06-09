describe('worker threads', () => {
    const mocks = {
        parallelism: {
            parent: {
                pool: {
                    createTestsPools: jest.fn(() => {})
                }
            },
            threads: {
                manage: {
                    createChild: jest.fn(async () => {})
                }
            }
        }
    };

    beforeEach(() => {
        jest.mock('./parallelism/parent/pool', () => mocks.parallelism.parent.pool);
        jest.mock('./parallelism/threads/manage', () => mocks.parallelism.threads.manage);
    });

    it('parent thread should be created one single time', () => {
        jest.mock('node:worker_threads', () => ({
            isMainThread: true
        }));
        require('./index');
        expect(mocks.parallelism.parent.pool.createTestsPools).toHaveBeenCalledTimes(1);
        expect(mocks.parallelism.threads.manage.createChild).toHaveBeenCalledTimes(0);
    });

    it('child threads should be created multiple times', () => {
        jest.mock('node:worker_threads', () => ({
            isMainThread: false
        }));
        require('./index');
        expect(mocks.parallelism.parent.pool.createTestsPools).toHaveBeenCalledTimes(0);
        expect(mocks.parallelism.threads.manage.createChild).toHaveBeenCalledTimes(1);
    });
});

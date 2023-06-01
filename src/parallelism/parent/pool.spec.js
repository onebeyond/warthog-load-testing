describe('main worker', () => {
    const mocks = {
        parallelism: {
            parent: {
                worker: {
                    create: jest.fn(() => {})
                }
            }
        },
        os: {
            fs: {
                getTestsList: jest.fn(() => ['script_1.js', 'script_2.js'])
            },
            cpu: {
                getParallelismAmount: jest.fn(() => 1)
            }
        }
    };

    beforeEach(() => {
        jest.mock('../../os/fs', () => mocks.os.fs);
        jest.mock('../../os/cpu', () => mocks.os.cpu);
        jest.mock('./worker', () => mocks.parallelism.parent.worker);
    });

    it('pool creation', () => {
        const { createTestsPools } = require('./pool');
        createTestsPools();
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledTimes(2);
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledWith('script_1.js');
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledWith('script_2.js');
    });
});

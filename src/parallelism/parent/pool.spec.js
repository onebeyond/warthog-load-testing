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
                getParallelismAmount: (amount) => jest.fn(() => amount)
            }
        }
    };

    beforeEach(() => {
        jest.mock('../../os/fs', () => mocks.os.fs);
        jest.mock('./worker', () => mocks.parallelism.parent.worker);
    });

    it('pool creation single thread', () => {
        jest.mock('../../os/cpu', () => ({
            getParallelismAmount: mocks.os.cpu.getParallelismAmount(1)
        }));
        const { createTestsPools } = require('./pool');
        createTestsPools();
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledTimes(2);
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledWith('script_1.js');
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledWith('script_2.js');
    });

    it('pool creation multiple threads', () => {
        jest.mock('../../os/cpu', () => ({
            getParallelismAmount: mocks.os.cpu.getParallelismAmount(2)
        }));
        const { createTestsPools } = require('./pool');
        createTestsPools();
        expect(mocks.parallelism.parent.worker.create).toHaveBeenCalledTimes(4);
        expect(mocks.parallelism.parent.worker.create.mock.calls).toEqual([
            ['script_1.js'],
            ['script_1.js'],
            ['script_2.js'],
            ['script_2.js']
        ]);
    });
});

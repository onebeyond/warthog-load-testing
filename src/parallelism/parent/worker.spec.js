describe('worker', () => {
    const mocks = {
        node: {
            Worker: jest.fn(() => {})
        },
        parallelism: {
            threads: {
                events: {
                    handleEvents: jest.fn(() => {})
                }
            }
        }
    };

    beforeEach(() => {
        jest.mock('node:worker_threads', () => ({
            Worker: mocks.node.Worker
        }));
    });

    it('should create the thread', () => {
        jest.mock('../threads/events', () => mocks.parallelism.threads.events);
        const { create } = require('./worker');
        create('script_1.js');
        expect(mocks.node.Worker.mock.calls[0][1]).toEqual({ workerData: { path: 'script_1.js' } });
    });
});

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
        jest.mock('./orchestrator/events', () => mocks.parallelism.threads.events);
        const { create } = require('./worker');
        create('./test/fixtures/tests/working/minimum-timeout.js');
        expect(mocks.node.Worker.mock.calls[0][1]).toEqual({
            workerData: {
                iterations: 1,
                path: './test/fixtures/tests/working/minimum-timeout.js'
            }
        });
        expect(mocks.parallelism.threads.events.handleEvents).toHaveBeenCalledTimes(1);
        expect(mocks.parallelism.threads.events.handleEvents).toHaveBeenCalledWith(
            {},
            {
                expect: {},
                stages: [{ iterations: 1, seconds: 1 }]
            }
        );
    });
});

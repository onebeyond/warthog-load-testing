const { EventEmitter } = require('node:events');

describe('parent thread communications', () => {
    class MockParentPortEventEmitter extends EventEmitter {
        postMessage(data) {
            super.emit('message', data);
        }
    }

    it('subscribe child', () => {
        jest.mock('node:worker_threads', () => {
            return {
                workerData: {
                    iterations: 1
                },
                parentPort: new MockParentPortEventEmitter()
            };
        });

        const { subscribeParent } = require('./process-communication');
        subscribeParent();

        const { parentPort, workerData } = require('node:worker_threads');
        parentPort.postMessage({ iterations: 2 });
        expect(workerData.iterations).toBe(2);
    });
});

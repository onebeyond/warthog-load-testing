const { EventEmitter } = require('node:events');

describe('parent thread communications', () => {
    class MockParentPortEventEmitter extends EventEmitter {
        postMessage(data) {
            super.emit('message', data);
        }
    }

    beforeEach(() => {
        jest.mock('node:worker_threads', () => {
            return {
                workerData: {
                    iterations: 1
                },
                parentPort: new MockParentPortEventEmitter()
            };
        });
    });

    it('subscribe child', () => {
        const { subscribeParent } = require('./process-communication');
        subscribeParent();

        const { parentPort, workerData } = require('node:worker_threads');
        parentPort.postMessage({ iterations: 2 });
        expect(workerData.iterations).toBe(2);
    });

    describe('notify parent', () => {
        describe('lifecycle', () => {
            it('setup', () => {
                const { notify } = require('./process-communication');
                const { parentPort } = require('node:worker_threads');

                const subscribeMessageMock = jest.fn(() => {});
                parentPort.on('message', subscribeMessageMock);

                expect(subscribeMessageMock).toHaveBeenCalledTimes(0);
                notify.finished.lifecycle.setup();
                expect(subscribeMessageMock).toHaveBeenCalledTimes(1);
            });
        });
    });
});

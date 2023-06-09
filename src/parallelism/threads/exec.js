const { parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');
const { notify: processCommunicationNotify } = require('./process-communication');
const { getPerformance } = require('../../performance/analysis');

const executeLifecycle = {
    setup: async () => {
        await workerData.testLifecycle.setup();
        processCommunicationNotify.finished.lifecycle.setup();
    },
    test: async () => {
        workerData.threadTimerIteration = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let testIteration = 0;
            // eslint-disable-next-line no-loop-func
            Array.from({ length: workerData.iterations }).forEach(async () => {
                testIteration += 1;
                try {
                    const { duration } = await getPerformance({
                        test: workerData.testLifecycle.test,
                        iterations: {
                            loopIteration: testIteration,
                            threadIteration: workerData.threadTimerIteration
                        }
                    });
                    parentPort.postMessage({ iteration: { duration } });
                } catch (error) {
                    console.log(error);
                    parentPort.postMessage({ iteration: {} });
                }
            });

            // eslint-disable-next-line no-await-in-loop
            await setTimeout(1000);
            workerData.threadTimerIteration += 1;
        }
    }
};

module.exports = {
    executeLifecycle
};

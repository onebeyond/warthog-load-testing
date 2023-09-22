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
        // eslint-disable-next-line no-constant-condition
        while (!process.env.WARTHOG_END) {
            // eslint-disable-next-line no-loop-func
            Array.from({ length: workerData.iterations }).forEach(async () => {
                try {
                    const duration = await getPerformance(workerData.testLifecycle.test);
                    parentPort.postMessage({ iteration: { duration } });
                } catch (error) {
                    console.error(error);
                    parentPort.postMessage({ iteration: {} });
                    process.env.WARTHOG_END = true;
                }
            });

            // eslint-disable-next-line no-await-in-loop
            await setTimeout(1000);
        }
    }
};

module.exports = {
    executeLifecycle
};

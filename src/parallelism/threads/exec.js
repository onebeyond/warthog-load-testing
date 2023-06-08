const { parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

const { getPerformance } = require('../../performance/analysis');
const { validate: validateTestLifecycle } = require('../../utils/test/lifecycle');

async function executeChild() {
    parentPort.on('message', ({ iterations }) => {
        workerData.iterations = iterations;
    });

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const testLifecycleValidator = validateTestLifecycle.byTestPath(workerData.path);
    const { setup, test } = {
        setup: testLifecycleValidator.setup(),
        test: testLifecycleValidator.test()
    };

    await setup();
    parentPort.postMessage({ setupFinished: true });

    let threadIteration = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        let loopIteration = 0;
        // eslint-disable-next-line no-loop-func
        Array.from({ length: workerData.iterations }).forEach(async () => {
            loopIteration += 1;
            try {
                const { duration } = await getPerformance({
                    test,
                    iterations: {
                        loopIteration,
                        threadIteration
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
        threadIteration += 1;
    }
}

module.exports = {
    executeChild
};

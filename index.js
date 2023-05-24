const { Worker, isMainThread, parentPort, workerData, threadId } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

require('dotenv').config();

const { getParallelismAmount } = require('./src/os/cpu');
const { getTestsList } = require('./src/os/fs');
const { debug } = require('./src/utils/log');

async function main() {
    if (isMainThread) {
        const scripts = getTestsList();

        await Promise.all(
            scripts.map(async (script) => {
                const parallelismAmount = getParallelismAmount();
                const threads = new Set();
                const { WARTHOG_DURATION: warthogDuration } = process.env;

                debug(
                    'config',
                    `Warthog duration ${warthogDuration}, workers ${parallelismAmount}`
                );

                for (
                    let workerInstance = 0;
                    workerInstance < parallelismAmount;
                    workerInstance += 1
                ) {
                    const worker = new Worker(__filename, { workerData: { path: script } });
                    debug('parallelism:parent', `Trying to create worker ${worker.threadId}`);
                    threads.add(worker);
                }

                const iterations = [];
                threads.forEach((worker) => {
                    debug(
                        'parallelism:parent',
                        `Activating events subscription for worker ${worker.threadId}`
                    );
                    worker.on('error', async (error) => {
                        console.error(error);
                        await worker.terminate();
                    });

                    worker.on('exit', () => {
                        threads.delete(worker);

                        console.log(`Thread exiting, ${threads.size} running...`);

                        if (threads.size === 0) {
                            debug('parallelism:parent', 'All threads finished');
                            console.log(
                                `Total executed iterations for ${script}: ${iterations.length}`
                            );
                        }
                    });

                    worker.on('message', async ({ setupFinished, executedIterations }) => {
                        if (setupFinished) {
                            await setTimeout(warthogDuration);
                            await worker.terminate();
                        }

                        if (executedIterations) {
                            iterations.push(executedIterations);
                        }
                    });
                });
            })
        );
    } else {
        console.info(`Worker ${threadId} data: ${JSON.stringify(workerData)}`);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const { setup, test } = require(workerData.path);
        await setup();
        parentPort.postMessage({ setupFinished: true });

        const { SCRIPT_ITERATIONS: iterations } = process.env;
        console.info(`Worker ${threadId} configured iterations ${iterations}`);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            for (let iteration = 0; iteration < iterations; iteration += 1) {
                // eslint-disable-next-line no-await-in-loop
                await test();
                parentPort.postMessage({ executedIterations: { threadId } });
            }
            // eslint-disable-next-line no-await-in-loop
            await setTimeout(1000);
        }
    }
}

module.exports = {
    main
};

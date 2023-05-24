const { isMainThread, parentPort, workerData, threadId } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

require('dotenv').config();

const { WARTHOG_DURATION: warthogDuration } = process.env;
const { getTestsList } = require('./src/os/fs');
const { create: createWorkersPool } = require('./src/parallelism/pool');

async function main() {
    if (isMainThread) {
        const scripts = getTestsList();
        scripts.forEach((script) => createWorkersPool(script, warthogDuration));
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

main();

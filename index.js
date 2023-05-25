#! /usr/bin/env node

const { isMainThread, parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

require('dotenv').config();

const { WARTHOG_DURATION: warthogDuration } = process.env;
const { getTestsList } = require('./src/os/fs');
const { create: createWorkersPool } = require('./src/parallelism/pool');
const { getPerformance } = require('./src/performance/analysis');

async function main() {
    /**
     * There is only one main thread. This means the following conditional would be executed
     * one single time before creating all the workers.
     */
    if (isMainThread) {
        const scripts = getTestsList();
        scripts.forEach((script) => createWorkersPool(script, warthogDuration));
    } else {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const { setup, test } = require(workerData.path);

        await setup();
        parentPort.postMessage({ setupFinished: true });

        const { SCRIPT_ITERATIONS: iterations } = process.env;

        let threadIteration = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let loopIteration = 0;
            // eslint-disable-next-line no-loop-func
            Array.from({ length: iterations }).forEach(async () => {
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
}

main();

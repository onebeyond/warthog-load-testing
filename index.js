const {
    Worker,
    isMainThread,
    parentPort,
    workerData,
    threadId,
} = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

require('dotenv').config();

const { getParallelismAmount } = require('./src/os/cpu');
const { getTestsList } = require('./src/os/fs');

async function main() {
    if (isMainThread) {
        const scripts = getTestsList();

        scripts.forEach(script => {
            const parallelismAmount = getParallelismAmount();
            const threads = new Set();

            for (let workerInstance = 0; workerInstance < parallelismAmount; workerInstance++) {
                const worker = new Worker(__filename, { workerData: { path: script } })
                threads.add(worker);
            }

            threads.forEach(worker => {
                worker.on('error', err => {
                    throw err;
                });

                worker.on('exit', () => {
                    threads.delete(worker);

                    console.log(`Thread exiting, ${threads.size} running...`);

                    if (threads.size === 0) {
                        console.log(`All threads finished`)
                    }
                });

                worker.on('message', message => {
                    console.log(message)
                });
            })
        })

    } else {
        console.log(`Worker ${threadId} data: ${JSON.stringify(workerData)}`);
        const { setup, test } = require(workerData.path);
        await setup();

        const { SCRIPT_ITERATIONS: iterations } = process.env;

        while (true) {
            for (let iteration = 0; iteration < iterations; iteration++) {
                await test();
            }
            await setTimeout(1000);
        }

        parentPort.postMessage(1)
    }
};

main();
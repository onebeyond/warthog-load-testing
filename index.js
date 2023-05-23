const {
    Worker,
    isMainThread,
    parentPort,
    workerData,
    threadId,
} = require('node:worker_threads');

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
        await test();
        parentPort.postMessage(1)
    }
};

main();
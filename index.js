const {
    Worker,
    isMainThread,
    parentPort,
    workerData,
    threadId,
} = require('node:worker_threads');

const { getParallelismAmount } = require('./src/os/cpu');

if (isMainThread) {
    const parallelismAmount = getParallelismAmount();
    const threads = new Set();

    for (let workerInstance = 0; workerInstance < parallelismAmount; workerInstance++) {
        const worker = new Worker(__filename, { workerData: { path: '' } })
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
} else {
    console.log(`Worker ${threadId} data: ${JSON.stringify(workerData)}`);
}
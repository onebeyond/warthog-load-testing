const { setTimeout } = require('node:timers/promises');
const { debug } = require('../utils/log');

const threads = new Set();
// All the threads would be keeping data on it.
const scriptIterations = {
    succeed: [],
    error: []
};

function handleEvents(worker, duration) {
    const { threadId } = worker;

    threads.add(threadId);
    const debugLabel = `parallelism:thread:${threadId}`;
    debug(debugLabel, 'Activating events subscription');

    worker.on('error', async (error) => {
        console.error(error);
        await worker.terminate();
    });

    worker.on('exit', () => {
        threads.delete(threadId);

        debug(debugLabel, `Thread ${threadId} exiting, ${threads.size} running...`);

        if (threads.size === 0) {
            console.table({
                succeed: {
                    amount: scriptIterations.succeed.length,
                    average:
                        scriptIterations.succeed.reduce((a, b) => a + b, 0) /
                        scriptIterations.succeed.length /
                        1000.0
                },
                failed: { amount: scriptIterations.error.length }
            });
        }
    });

    worker.on('message', async ({ setupFinished, iteration }) => {
        if (iteration?.duration) {
            scriptIterations.succeed.push(iteration.duration);
        } else if (iteration) {
            scriptIterations.error.push(iteration);
        }

        if (setupFinished) {
            await setTimeout(duration);
            await worker.terminate();
        }
    });
}

module.exports = {
    handleEvents
};

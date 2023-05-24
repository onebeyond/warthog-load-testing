const { setTimeout } = require('node:timers/promises');
const { debug } = require('../utils/log');

const threads = new Set();
const scriptIterations = [];

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
            console.log(`Workers pool executed ${scriptIterations.length} iterations`);
        }
    });

    worker.on('message', async ({ setupFinished, executedIterations }) => {
        if (setupFinished) {
            await setTimeout(duration);
            await worker.terminate();
        }

        if (executedIterations) {
            scriptIterations.push(executedIterations);
        }
    });
}

module.exports = {
    handleEvents
};

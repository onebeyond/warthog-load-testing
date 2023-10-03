const { setTimeout } = require('node:timers/promises');
const { debug } = require('../../../utils/log');
const { allIterationsFinished } = require('./eval');

const threads = new Set();
// All the threads would be keeping data on it.
const scriptIterations = {
    succeed: [],
    error: []
};

/**
 * Subscribing all the pool workers would help the parent one to monitor the reported events
 * @param {Worker} worker - The pool worker to which we are going to subscribe to its events
 * @param {*} test - We would retrieve only the test lifecycles that are useful to orchestrate and obtain metrics
 */
function handleEvents(worker, test) {
    const { threadId } = worker;
    const { expect, stages } = test;

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
            allIterationsFinished(scriptIterations, expect);
        }
    });

    worker.on('message', async ({ setupFinished, iteration }) => {
        if (iteration?.duration) {
            scriptIterations.succeed.push(iteration.duration);
        } else if (iteration) {
            scriptIterations.error.push(iteration);
        }

        if (setupFinished) {
            // eslint-disable-next-line no-restricted-syntax
            for (const stage of stages) {
                worker.postMessage({ iterations: stage.iterations });
                // eslint-disable-next-line no-await-in-loop
                await setTimeout(stage.seconds * 1000);
            }
            await worker.terminate();
        }
    });
}

module.exports = {
    handleEvents
};

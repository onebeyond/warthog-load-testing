const { Worker } = require('node:worker_threads');
const { debug } = require('../../utils/log');
const { handleEvents: handleThreadEvent } = require('./orchestrator/events');
const { validate: validateTestLifecycle } = require('../../utils/test/lifecycle');

const debugLabel = 'parallelism:worker';

function create(testPath) {
    const stages = validateTestLifecycle.byTestPath(testPath).stages();
    const worker = new Worker(require.main.filename, {
        workerData: { path: testPath, iterations: stages[0].iterations }
    });
    debug(debugLabel, `Trying to create worker ${worker.threadId}`);
    handleThreadEvent(worker, stages);
}

module.exports = {
    create
};

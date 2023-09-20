const { Worker } = require('node:worker_threads');
const { debug } = require('../../utils/log');
const { handleEvents: handleThreadEvent } = require('./orchestrator/events');
const { validate: validateTestLifecycle } = require('../../utils/test/lifecycle');

const debugLabel = 'parallelism:worker';

function create(testPath) {
    const testValidator = validateTestLifecycle.byTestPath(testPath);
    const stages = testValidator.stages();
    const worker = new Worker(require.main.filename, {
        workerData: { path: testPath, iterations: stages[0].iterations }
    });

    debug(debugLabel, `Trying to create worker ${worker.threadId}`);
    handleThreadEvent(worker, {
        expect: testValidator.expect(),
        stages
    });
}

module.exports = {
    create
};

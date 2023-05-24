const { Worker } = require('node:worker_threads');
const { debug } = require('../utils/log');
const { handleEvents: handleThreadEvent } = require('./threads');

const debugLabel = 'parallelism:worker';

function create(script, warthogDuration) {
    const worker = new Worker(require.main.filename, { workerData: { path: script } });
    debug(debugLabel, `Trying to create worker ${worker.threadId}`);
    handleThreadEvent(worker, warthogDuration);
}

module.exports = {
    create
};

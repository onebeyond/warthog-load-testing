const { Worker } = require('node:worker_threads');
const { debug } = require('../../utils/log');
const { handleEvents: handleThreadEvent } = require('../threads/events');

const debugLabel = 'parallelism:worker';
const { WARTHOG_DURATION: warthogDuration } = process.env;

function create(test) {
    const worker = new Worker(require.main.filename, { workerData: { path: test } });
    debug(debugLabel, `Trying to create worker ${worker.threadId}`);
    handleThreadEvent(worker, warthogDuration);
}

module.exports = {
    create
};

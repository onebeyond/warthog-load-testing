const { workerData } = require('node:worker_threads');
const { subscribeParent } = require('./process-communication');
const { validate: validateTestLifecycle } = require('../../utils/test/lifecycle');
const { executeLifecycle } = require('./exec');

/**
 * Is considered a lifecycle the different test phases.
 * This phases always occur without overlapping at the same time.
 * That means that each sequence of the test depends on the previous one
 * to become finished.
 */
function defineLifecycle() {
    const testLifecycleValidator = validateTestLifecycle.byTestPath(workerData.path);
    workerData.testLifecycle = {
        setup: testLifecycleValidator.setup(),
        test: testLifecycleValidator.test()
    };
}

/**
 * This is immediately executed by a child worker.
 * Would init everything for being able to validate, execute the test based
 * on the configured params and report the metrics to the parent process.
 */
async function createChild() {
    defineLifecycle();
    subscribeParent();

    await executeLifecycle.setup();
    await executeLifecycle.test();
}

module.exports = {
    createChild
};

const { workerData } = require('node:worker_threads');
const { subscribeParent } = require('./process-communication');
const { validate: validateTestLifecycle } = require('../../utils/test/lifecycle');
const { executeLifecycle } = require('./exec');

function defineLifecycle() {
    const testLifecycleValidator = validateTestLifecycle.byTestPath(workerData.path);
    workerData.testLifecycle = {
        setup: testLifecycleValidator.setup(),
        test: testLifecycleValidator.test()
    };
}

async function createChild() {
    defineLifecycle();
    subscribeParent();

    await executeLifecycle.setup();
    await executeLifecycle.test();
}

module.exports = {
    createChild
};

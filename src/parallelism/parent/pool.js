const { getParallelismAmount } = require('../../os/cpu');
const { debug } = require('../../utils/log');
const { getTestsList } = require('../../os/fs');
const { create: createWorker } = require('./worker');

const parallelismAmount = getParallelismAmount();
const debugLabel = 'parallelism:parent';

/**
 * All the workers that the parent process has created with the same test path
 * are considered a pool of workers
 * @param {string} testPath Test file system path sent to all the workers
 */
function createPoolWorkers(testPath) {
    debug(debugLabel, `Creating ${parallelismAmount} workers ...`);

    for (let workerInstance = 0; workerInstance < parallelismAmount; workerInstance += 1) {
        createWorker(testPath);
    }
}

/**
 * For each test path included by the user a new pool of workers would be created.
 * This function is being executed one single time by the parent process.
 */
function createTestsPools() {
    const testPaths = getTestsList();
    testPaths.forEach((testPath) => createPoolWorkers(testPath));
}

module.exports = {
    createTestsPools
};

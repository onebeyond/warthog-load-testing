const { getParallelismAmount } = require('../../os/cpu');
const { debug } = require('../../utils/log');
const { getTestsList } = require('../../os/fs');
const { create: createWorker } = require('./worker');

const parallelismAmount = getParallelismAmount();
const debugLabel = 'parallelism:parent';

function createPoolWorkers(test) {
    debug(debugLabel, `Creating ${parallelismAmount} workers ...`);

    for (let workerInstance = 0; workerInstance < parallelismAmount; workerInstance += 1) {
        createWorker(test);
    }
}

function createTestsPools() {
    const tests = getTestsList();
    tests.forEach((test) => createPoolWorkers(test));
}

module.exports = {
    createTestsPools
};

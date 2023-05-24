const { getParallelismAmount } = require('../os/cpu');
const { debug } = require('../utils/log');
const { create: createWorker } = require('./worker');

const parallelismAmount = getParallelismAmount();
const debugLabel = 'parallelism:parent';

function create(script, warthogDuration) {
    debug(
        debugLabel,
        `Warthog duration ${warthogDuration}, creating ${parallelismAmount} workers ...`
    );

    for (let workerInstance = 0; workerInstance < parallelismAmount; workerInstance += 1) {
        createWorker(script, warthogDuration);
    }
}

module.exports = {
    create
};

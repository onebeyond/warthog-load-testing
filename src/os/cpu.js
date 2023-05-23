const { availableParallelism } = require('node:os');

const { debug } = require('../utils/log');

function getParallelismAmount() {
    const parallelismAmount = availableParallelism();
    debug('os', `Detected parallelism amount -> ${parallelismAmount}`);
    return parallelismAmount;
}

module.exports = {
    getParallelismAmount
}
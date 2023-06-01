const { availableParallelism } = require('node:os');

const { debug } = require('../utils/log');

function getParallelismAmount() {
    const { SCRIPT_PARALLELISM: manuallySetScriptParallelism } = process.env;
    if (manuallySetScriptParallelism) {
        return +manuallySetScriptParallelism;
    }

    const parallelismAmount = availableParallelism();
    debug('os', `Detected parallelism amount -> ${parallelismAmount}`);
    return parallelismAmount;
}

module.exports = {
    getParallelismAmount
};

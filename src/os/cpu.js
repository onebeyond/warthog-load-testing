const { availableParallelism } = require('node:os');

const { debug } = require('../utils/log');

/**
 * If the amount of workers is not defined by the user it would be
 * detected and the maximum amount of worker would be used. That maximum
 * value is the amount CPU cores available from the machine where the test
 * are being executed.
 * @returns {number} Amount of machine CPUs
 */
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

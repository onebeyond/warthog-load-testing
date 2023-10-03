const { performance } = require('node:perf_hooks');

/**
 * The most efficient way to do not stress the system creating latency for obtaining metrics
 * is to read the current process date.
 * @param {Function} execFunction - The test function executed during the iterations
 * @returns {number} - Millisecons that the execution of the iteration took without
 * taking into account the amount of time taken to calculate the execution time
 */
async function getPerformance(execFunction) {
    const start = performance.now();
    await execFunction();
    return performance.now() - start;
}

module.exports = {
    getPerformance
};

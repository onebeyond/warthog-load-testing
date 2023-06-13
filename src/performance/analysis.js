const { performance } = require('node:perf_hooks');

async function getPerformance(execFunction) {
    const start = performance.now();
    await execFunction();
    return performance.now() - start;
}

module.exports = {
    getPerformance
};

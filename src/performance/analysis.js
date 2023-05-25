const { performance, PerformanceObserver } = require('node:perf_hooks');

new PerformanceObserver(() => {}).observe({ entryTypes: ['measure'] });

async function getPerformance({ test: func, iterations: { loopIteration, threadIteration } }) {
    const performanceMarks = {
        start: `${threadIteration}-${loopIteration}-start`,
        end: `${threadIteration}-${loopIteration}-end`
    };

    performance.mark(performanceMarks.start);
    await func();
    performance.mark(performanceMarks.end);

    return performance.measure(`${threadIteration}`, performanceMarks.start, performanceMarks.end);
}

module.exports = {
    getPerformance
};

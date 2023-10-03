function getAverageDuration({ succeed, amount }) {
    return succeed.reduce((a, b) => a + b, 0) / amount / 1000.0;
}

function testAveragePassed(expected, current) {
    return current <= expected;
}

/**
 * The final output of the test after all the iterations has finished
 * is displayed form there
 * @param {Object} finishedIterations
 * @param {Array} finishedIterations.succeed - Iterations that are finished and did not throw any error
 * @param {Array} finishedIterations.error - Iterations that throwed some error
 * @param {Object} expect
 * @param {number} expect.average - Seconds that are expected not to be exceeded
 */
function allIterationsFinished({ succeed, error }, expect) {
    const { length: succeedAmount } = succeed;
    const { length: errorAmount } = error;

    const succeedAverage = getAverageDuration({ succeed, amount: succeedAmount });

    console.table({
        succeed: {
            amount: succeedAmount,
            average: succeedAverage
        },
        failed: { amount: errorAmount }
    });

    console.table({
        average: {
            current: succeedAverage,
            passed: testAveragePassed(expect.average, succeedAverage)
        }
    });
}

module.exports = {
    allIterationsFinished
};

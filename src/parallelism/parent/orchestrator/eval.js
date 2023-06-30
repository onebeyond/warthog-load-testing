function getAverageDuration({ succeed, amount }) {
    return succeed.reduce((a, b) => a + b, 0) / amount / 1000.0;
}

function testAveragePassed(expected, current) {
    return current > expected;
}

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

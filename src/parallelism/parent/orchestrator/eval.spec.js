const mocks = {
    console: {
        table: jest.spyOn(global.console, 'table').mockReturnValue(() => {})
    }
};

jest.mock('console', () => {
    return {
        table: mocks.console.table
    };
});
const { allIterationsFinished } = require('./eval');

describe('eval', () => {
    describe('passed', () => {
        const testResult = { succeed: [0, 1000], error: [200] };
        const testPerformance = [{ succeed: { amount: 2, average: 0.5 }, failed: { amount: 1 } }];

        it('true', () => {
            allIterationsFinished(testResult, { average: 0.5 });
            expect(mocks.console.table.mock.calls).toEqual([
                testPerformance,
                [{ average: { current: 0.5, passed: true } }]
            ]);
        });

        it('false', () => {
            allIterationsFinished(testResult, { average: 0.4 });
            expect(mocks.console.table.mock.calls).toEqual([
                testPerformance,
                [{ average: { current: 0.5, passed: false } }]
            ]);
        });
    });
});

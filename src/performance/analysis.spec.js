const { performance } = require('node:perf_hooks');
const { getPerformance } = require('./analysis');

describe('measure perfomance', () => {
    it('function test iteration', async () => {
        Object.defineProperty(performance, 'now', {
            value: jest.fn(),
            configurable: true,
            writable: true
        });
        const nowSpy = jest.spyOn(performance, 'now');
        nowSpy.mockReturnValueOnce(1000).mockReturnValueOnce(3000);

        jest.useFakeTimers();

        const testFunction = () => new Promise((resolve) => setTimeout(resolve, 2000));
        const performancePromise = getPerformance(testFunction);

        jest.advanceTimersByTime(2000);

        const performanceResult = await performancePromise;
        expect(performanceResult).toBe(2000);

        jest.useRealTimers();
    });
});

describe('available parallelism', () => {
    it('should detect os cpus amount', () => {
        jest.mock('node:os', () => ({
            availableParallelism: () => 12
        }));

        const { getParallelismAmount } = require('./cpu');
        expect(getParallelismAmount()).toBe(12);
    });

    it('should detect os cpus amount', () => {
        process.env.SCRIPT_PARALLELISM = 4;

        const { getParallelismAmount } = require('./cpu');
        expect(getParallelismAmount()).toBe(4);
    });
});

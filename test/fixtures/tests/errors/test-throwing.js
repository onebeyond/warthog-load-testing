module.exports = {
    stages: [{ iterations: 1, seconds: 1 }],
    setup: () => {},
    test: async () => {
        throw new Error('Custom forced error');
    }
};

module.exports = {
    stages: [{ iterations: 1, seconds: 1 }],
    setup: async () => {
        throw new Error('Custom forced error');
    },
    test: () => {}
};

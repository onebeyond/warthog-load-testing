module.exports = {
    iterations: 1,
    setup: async () => {
        throw new Error('Custom forced error');
    },
    test: () => {}
};

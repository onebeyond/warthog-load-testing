module.exports = {
    stages: [{ iterations: 2, seconds: 1 }],
    setup: () => {},
    test: () => {
        throw new Error('Custom forced error');
    }
};

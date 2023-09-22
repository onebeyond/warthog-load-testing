module.exports = {
    stages: [{ iterations: 2, seconds: 1 }],
    setup: () => {},
    test: () => {
        // Setting this variable would stop the loop around the main function fo the test
        process.env.WARTHOG_END = true;
    },
    expect: []
};

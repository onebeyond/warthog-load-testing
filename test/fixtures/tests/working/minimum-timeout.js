const { setTimeout } = require('node:timers/promises');

async function test() {
    await setTimeout(500);
}

module.exports = {
    stages: [{ iterations: 1, seconds: 1 }],
    setup: () => {},
    test,
    expect: []
};

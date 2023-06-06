const { setTimeout } = require('node:timers/promises');

async function test() {
    await setTimeout(500);
}

module.exports = {
    iterations: 1,
    setup: () => {},
    test
};

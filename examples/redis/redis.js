const { createClient } = require('redis');
const { v4 } = require('uuid');

let client;

async function setup() {
    client = createClient({
        url: 'redis://warthog-stress-test-redis:6379'
    });
    client.on('error', (err) => {
        throw new Error('Redis Client Error', err);
    });
    await client.connect();
}

async function test() {
    const key = v4();
    // console.info(`Inserting key ${key}`);
    await client.set(key, 'value');
}

module.exports = {
    setup,
    test
};

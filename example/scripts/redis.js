const { createClient } = require('redis');
const { v4 } = require('uuid');

let client;

async function setup() {
    const host = process.env.REDIS_HOST || 'localhost';
    client = createClient({
        url: `redis://${host}:6379`
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
    stages: [
        {
            iterations: 4,
            seconds: 4
        }
    ],
    setup,
    test,
    expect: []
};

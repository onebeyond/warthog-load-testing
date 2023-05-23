const { createClient } = require('redis');

let client;

async function setup() {
    client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
}

async function test() {
    await client.set('key', 'value');
}

module.exports = {
    setup,
    test,
}
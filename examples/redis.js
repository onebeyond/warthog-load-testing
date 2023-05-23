const { createClient } = require('redis');
const { v4 } = require('uuid');

let client;

async function setup() {
    client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
}

async function test() {
    const key = v4();
    console.log(`Inserting key ${key}`);
    await client.set(v4(), 'value');
}

module.exports = {
    setup,
    test,
}
const { setTimeout } = require('timers/promises');

const { createClient } = require('redis');
const { main } = require('../index');

describe('main', () => {
    it('should execute provided function', async () => {
        const client = createClient();
        await client.connect();
        await client.flushAll();

        await main();
        await setTimeout(+process.env.WARTHOG_DURATION + 1000);

        const keys = await client.keys('*');
        expect(keys).toHaveLength(32);
    });
});

const { v2: compose } = require('docker-compose');
const { createClient } = require('redis');

describe('e2e', () => {
    it('should execute provided function', async () => {
        await compose.buildOne('warthog', { cwd: './examples/redis' });
        await compose.upAll({ cwd: './examples/redis', log: true });

        const client = createClient();
        await client.connect();
        await client.flushAll();

        const getAllKeys = async () => client.keys('*');

        const initialKeys = await getAllKeys();
        expect(initialKeys).toHaveLength(0);

        await compose.exec('warthog', 'pnpm start', { cwd: './examples/redis', log: true });

        const finalKeys = await getAllKeys();
        expect(finalKeys).toHaveLength(32);

        await client.disconnect();
        await compose.down({ cwd: './examples/redis' });
    });
});

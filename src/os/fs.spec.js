const { writeFileSync } = require('node:fs');
const { getTestsList } = require('./fs');

describe('detect script to execute', () => {
    it('should throw an error if there is no config about it', () => {
        expect(getTestsList).toThrow('WARTHOG_TESTS_PATH is undefined');
    });
});
